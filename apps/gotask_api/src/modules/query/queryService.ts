import moment from "moment";
import momentTimezone from "moment-timezone";
import natural, { Sentence } from "natural";
import mongoose, { Types } from "mongoose";
import {
  createQueryHistory,
  deleteAllQueryHistory,
  deleteQueryHistoryByConversationId,
  findQueryHistory
} from "../../domain/interface/query/queryInterface";
import { User } from "../../domain/model/user/user";
import { Attendance } from "../../domain/model/attendance/attendanceModel";
import attendanceService from "../attendance/attendanceService";
import queryTaskService from "../queryTask/queryTaskService";
import userService from "../user/userService";
import { QueryMessages } from "../../constants/apiMessages/queryMessages";
import { IQueryHistory } from "../../domain/model/query/queryModel";

declare module "moment" {
  interface Duration {
    format(template: string, options?: { trim?: boolean | string }): string;
  }
  interface Moment {
    tz(zone: string): Moment;
    tz(zone: string, formats: string[], strict?: boolean): Moment;
  }
}

const keywordMap: { [key: string]: string } = {
  intime: "intime",
  clockin: "intime",
  clocked: "intime",
  clockedin: "intime",
  outtime: "outtime",
  clockout: "outtime",
  clockedout: "outtime",
  details: "details",
  detail: "details",
  info: "details",
  late: "late",
  absent: "absent",
  average: "average",
  minutes: "late",
  attendance: "attendance",
  show: "attendance",
  working: "workinghours",
  hours: "workinghours",
  worked: "workinghours",
  after10am: "after10am",
  login: "after10am",
  lateafter10: "after10am",
  logoff: "latelogoff",
  logout: "latelogoff",
  after7pm: "latelogoff",
  project: "project",
  projects: "project",
  hoursspend: "hours",
  time: "hours",
  due: "due",
  deadline: "due",
  overdue: "overdue",
  after: "overdue",
  org: "organization",
  organization: "organization",
  task: "task",
  tasks: "task",
  finished: "finished",
  complete: "finished",
  completed: "finished",
  done: "finished",
  status: "status",
  state: "status",
  employees: "employees",
  employee: "employees",
  workers: "employees",
  list: "list",
  all: "list",
  assigned: "assigned",
  open: "open",
  uncompleted: "open",
  severity: "severity",
  spend: "hours",
  spent: "hours",
  lateafter: "late",
  minuteslate: "late",
  hoursworked: "workinghours"
};

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon("EN", "NN");
const ruleSet = new natural.RuleSet("EN");
const posTagger = new natural.BrillPOSTagger(lexicon, ruleSet);

interface TaggedToken {
  token: string;
  tag: string;
}

function tagPOS(tokens: string[]): { word: string; tag: string }[] {
  try {
    const sentence: Sentence = posTagger.tag(tokens);
    const taggedTokens: TaggedToken[] = sentence.taggedWords;
    return taggedTokens.map(({ token: word, tag }: TaggedToken) => ({
      word,
      tag
    }));
  } catch (err) {
    console.error(`POS Tagging error: ${(err as Error).message}`);
    return tokens.map((word: string) => ({ word, tag: "NN" }));
  }
}

function identifyDateTokens(query: string): Set<string> {
  const dateTokens = new Set<string>();
  const dateRegex =
    /\b(\d{1,2}-\d{1,2}-\d{4}|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+(?:\s+\d{4})?|[a-zA-Z]+\s+\d{1,2}(?:,)?\s+\d{4})\b/i;

  const matches = query.match(dateRegex);
  if (matches) {
    matches.forEach((match) => {
      const components = match.split(/[- ,]/).filter((c) => c);
      components.forEach((c) => dateTokens.add(c));
      dateTokens.add(match);
    });
  }
  const dayRegex = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
  const dayMatches = query.match(dayRegex);
  if (dayMatches) {
    dayMatches.forEach((match) => dateTokens.add(match));
  }
  const relativeRegex =
    /\b(this|last)\s+(week|month|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
  const relativeMatches = query.match(relativeRegex);
  if (relativeMatches) {
    relativeMatches.forEach((match) => dateTokens.add(match));
  }
  return dateTokens;
}

export const parseQuery = async (
  query: string
): Promise<{ success: boolean; data?: Record<string, any>; message?: string }> => {
  try {
    const result: Record<string, any> = {
      keywords: [],
      dates: [],
      empcode: null,
      empname: null,
      id: null,
      project_id: null,
      project_name: null,
      timeRange: null,
      user_id: null,
      name: null,
      date: undefined,
      hoursLate: false,
      employeeDetails: false,
      averageOutTime: false,
      averageInTime: false,
      dateRange: undefined,
      workinghours: false,
      after10am: false,
      latelogoff: false,
      projectDetails: false,
      organizationDetails: false,
      organizationName: null,
      taskDetails: false,
      hoursSpent: false,
      dueDate: false,
      overdueWork: false,
      isFinished: false,
      projectStatus: false,
      employeeCount: false,
      employees: false,
      employeeHours: false,
      listProjects: false,
      workAfterDue: false,
      isAttendanceQuery: false,
      taskStatus: false,
      taskSeverity: false,
      assignedEmployees: false,
      openTasks: false,
      completedTasks: false,
      projectAssignedHours: false,
      taskName: undefined
    };

    const lowerQuery = query.toLowerCase().trim();
    const tokens = tokenizer.tokenize(query) || [];
    const dateTokens = identifyDateTokens(query);
    const taggedTokens = tagPOS(tokens);

    const attendanceKeywords = [
      "intime",
      "outtime",
      "late",
      "absent",
      "average",
      "attendance",
      "workinghours",
      "after10am",
      "latelogoff"
    ];
    const hasAttendanceKeywords = tokens.some((token: any) =>
      attendanceKeywords.includes(keywordMap[token.toLowerCase()])
    );
    const isExplicitAttendance =
      hasAttendanceKeywords ||
      lowerQuery.includes("hours late") ||
      lowerQuery.includes("average outtime") ||
      lowerQuery.includes("average intime") ||
      lowerQuery.includes("working hours") ||
      lowerQuery.includes("hours worked") ||
      lowerQuery.includes("after 10am") ||
      lowerQuery.includes("logoff after 7pm") ||
      lowerQuery.includes("logout after 7pm") ||
      lowerQuery.includes("late login") ||
      lowerQuery.includes("minutes late");
    result.isAttendanceQuery =
      isExplicitAttendance &&
      !lowerQuery.includes("project") &&
      !lowerQuery.includes("task") &&
      !lowerQuery.includes("organization");

    const keywordsFound = new Set<string>();
    tokens.forEach((token: any) => {
      const normalizedToken = token.toLowerCase().replace(/'s$/, "");
      const keyword = keywordMap[normalizedToken];
      if (keyword && !keywordsFound.has(keyword)) {
        result.keywords.push(keyword);
        keywordsFound.add(keyword);
      }
    });

    const projectNameMatch = query.match(
      /(?:working under|assigned to|on|for)\s+(?:the\s+)?project\s+(.+?)(?=\s*(?:$|details|employees|hours|due|overdue|finished\??|status|employee|workers|\?))/i
    );
    if (projectNameMatch) {
      result.project_name = projectNameMatch[1].trim();
      result.assignedEmployees = true;
      if (!keywordsFound.has("project")) {
        result.keywords.push("project");
        keywordsFound.add("project");
      }
    } else {
      const fallbackNameMatch = query.match(
        /project\s+(.+?)(?=\s*(?:$|details|hours|hours spent|due|overdue|finished\??|status|employees|employee|workers|\?))/i
      );
      if (fallbackNameMatch) {
        result.project_name = fallbackNameMatch[1].trim();
      }
    }

    const projectIdMatch = query.match(/project\s+id\s+([a-zA-Z0-9_-]+)/i);
    if (projectIdMatch) {
      result.project_id = projectIdMatch[1];
    }

    const orgNameMatch = query.match(
      /(?:organization|org)\s+(.+?)(?=\s*(?:$|details|employees|employee|workers))/i
    );
    if (orgNameMatch) {
      result.organizationName = orgNameMatch[1].trim();
    }

    const taskNameMatch = query.match(
      /(?:task|tasks)\s+(.+?)(?=\s*(?:$|status|severity|hours|due|open|completed|uncompleted|assigned|spend|spent|by|for|on))/i
    );
    if (taskNameMatch) {
      result.taskName = taskNameMatch[1].trim();
    }

    if (
      result.isAttendanceQuery ||
      lowerQuery.includes("tasks") ||
      lowerQuery.includes("assigned to") ||
      lowerQuery.includes("by") ||
      lowerQuery.includes("spend") ||
      lowerQuery.includes("spent") ||
      lowerQuery.includes("for") ||
      lowerQuery.includes("info") ||
      lowerQuery.includes("details")
    ) {
      const byNameMatch = query.match(
        /(?:by|for|of|assigned to|info\s+of|details\s+of)\s+(.+?)(?:\s*(?:$|hours|spent|worked|tasks|intime|outtime|late|attendance|open|completed|uncompleted|on))/i
      );
      let nameTokens: string[] = [];
      if (byNameMatch) {
        const potentialName = byNameMatch[1].trim();
        if (
          (!result.project_name ||
            !potentialName.toLowerCase().includes(result.project_name.toLowerCase())) &&
          (!result.taskName ||
            !potentialName.toLowerCase().includes(result.taskName.toLowerCase())) &&
          (!result.organizationName ||
            !potentialName.toLowerCase().includes(result.organizationName.toLowerCase()))
        ) {
          nameTokens = potentialName.split(/\s+/);
        }
      } else {
        let inName = false;
        for (let i = 0; i < taggedTokens.length; i++) {
          const { word, tag } = taggedTokens[i];
          const normalizedWord = word.replace(/'s$/, "");
          if (
            (tag === "NNP" || tag === "NN") &&
            !keywordMap[word.toLowerCase()] &&
            ![
              "of",
              "on",
              "in",
              "at",
              "from",
              "to",
              "project",
              "organization",
              "task",
              "tasks",
              "info",
              "details"
            ].includes(word.toLowerCase()) &&
            !dateTokens.has(word) &&
            !word.match(/^\d+$/) &&
            (!result.project_name ||
              !normalizedWord.toLowerCase().includes(result.project_name.toLowerCase())) &&
            (!result.taskName ||
              !normalizedWord.toLowerCase().includes(result.taskName.toLowerCase())) &&
            (!result.organizationName ||
              !normalizedWord.toLowerCase().includes(result.organizationName.toLowerCase()))
          ) {
            nameTokens.push(normalizedWord);
            inName = true;
          } else if (inName && word.toLowerCase() === "'s") {
            continue;
          } else if (inName) {
            break;
          }
        }
      }
      if (nameTokens.length > 0) {
        const filteredNameTokens = nameTokens.filter(
          (token) =>
            !dateTokens.has(token) &&
            !token.match(
              /^(january|february|march|april|may|june|july|august|september|october|november|december|\d{4})$/i
            )
        );
        if (filteredNameTokens.length > 0) {
          const potentialName = filteredNameTokens.join(" ");
          if (
            (!result.project_name ||
              !potentialName.toLowerCase().includes(result.project_name.toLowerCase())) &&
            (!result.taskName ||
              !potentialName.toLowerCase().includes(result.taskName.toLowerCase())) &&
            (!result.organizationName ||
              !potentialName.toLowerCase().includes(result.organizationName.toLowerCase()))
          ) {
            result.empname = potentialName;
            result.name = potentialName;
          }
        }
      }
    }

    const empcodeMatch = query.match(/\b(\d{4,})\b/i);
    if (empcodeMatch && !dateTokens.has(empcodeMatch[1])) {
      result.empcode = empcodeMatch[1];
    }

    if (result.empname) {
      try {
        const user = await User.findOne({
          username: { $regex: `^${result.empname}$`, $options: "i" }
        }).lean();
        if (user) {
          result.user_id = user.user_id;
          result.name = user.name;
        }
      } catch (err) {
        console.error(`Error resolving user by name: ${(err as Error).message}`);
      }
    }

    if (
      lowerQuery.includes("late after 10am") ||
      lowerQuery.includes("login after 10am") ||
      lowerQuery.includes("clockin after 10am") ||
      lowerQuery.includes("late login")
    ) {
      result.after10am = true;
      if (!keywordsFound.has("after10am")) {
        result.keywords.push("after10am");
        keywordsFound.add("after10am");
      }
    }

    if (
      lowerQuery.includes("working hours") ||
      lowerQuery.includes("hours worked") ||
      lowerQuery.includes("work hours")
    ) {
      result.workinghours = true;
      if (!keywordsFound.has("workinghours")) {
        result.keywords.push("workinghours");
        keywordsFound.add("workinghours");
      }
    }

    if (
      lowerQuery.includes("logoff after 7pm") ||
      lowerQuery.includes("logout after 7pm") ||
      lowerQuery.includes("clockout after 7pm") ||
      lowerQuery.includes("logged off after 7pm")
    ) {
      result.latelogoff = true;
      if (!keywordsFound.has("latelogoff")) {
        result.keywords.push("latelogoff");
        keywordsFound.add("latelogoff");
      }
    }

    if (lowerQuery.includes("project details") || lowerQuery.includes("project info")) {
      result.projectDetails = true;
      if (!keywordsFound.has("project")) {
        result.keywords.push("project");
        keywordsFound.add("project");
      }
    }

    if (lowerQuery.includes("organization details") || lowerQuery.includes("org info")) {
      result.organizationDetails = true;
      if (!keywordsFound.has("organization")) {
        result.keywords.push("organization");
        keywordsFound.add("organization");
      }
    }

    if (
      lowerQuery.includes("task details") ||
      lowerQuery.includes("task info") ||
      lowerQuery.includes("tasks") ||
      lowerQuery.includes("assigned tasks") ||
      lowerQuery.includes("show tasks")
    ) {
      result.taskDetails = true;
      if (!keywordsFound.has("task")) {
        result.keywords.push("task");
        keywordsFound.add("task");
      }
    }

    if (
      lowerQuery.includes("open tasks") ||
      lowerQuery.includes("uncompleted tasks") ||
      lowerQuery.includes("tasks uncompleted") ||
      lowerQuery.includes("tasks open") ||
      lowerQuery.includes("are uncompleted")
    ) {
      result.openTasks = true;
      if (!keywordsFound.has("open")) {
        result.keywords.push("open");
        keywordsFound.add("open");
      }
    }

    if (
      lowerQuery.includes("minutes late") ||
      lowerQuery.includes("how many minutes") ||
      lowerQuery.includes("how late") ||
      lowerQuery.includes("late login")
    ) {
      result.hoursLate = true;
      if (!keywordsFound.has("late")) {
        result.keywords.push("late");
        keywordsFound.add("late");
      }
    }
    if (keywordsFound.has("details") && !result.isAttendanceQuery) {
      result.employeeDetails = true;
    }
    if (lowerQuery.includes("average outtime")) {
      result.averageOutTime = true;
    }
    if (lowerQuery.includes("average intime")) {
      result.averageInTime = true;
    }
    if (lowerQuery.includes("this week")) {
      result.timeRange = "this week";
    }
    if (lowerQuery.includes("last week")) {
      result.timeRange = "last week";
    }
    if (lowerQuery.includes("yesterday")) {
      result.timeRange = "yesterday";
    }
    if (lowerQuery.includes("last month")) {
      result.timeRange = "last month";
    }
    if (
      lowerQuery.includes("hours spent") ||
      lowerQuery.includes("time spent") ||
      lowerQuery.includes("hours worked") ||
      lowerQuery.includes("hours spend")
    ) {
      result.hoursSpent = true;
      if (!keywordsFound.has("hours")) {
        result.keywords.push("hours");
        keywordsFound.add("hours");
      }
    }
    if (
      lowerQuery.includes("due date") ||
      lowerQuery.includes("deadline") ||
      lowerQuery.includes("project due") ||
      lowerQuery.includes("task due")
    ) {
      result.dueDate = true;
      if (!keywordsFound.has("due")) {
        result.keywords.push("due");
        keywordsFound.add("due");
      }
    }

    if (
      lowerQuery.includes("overdue work") ||
      lowerQuery.includes("work after due") ||
      lowerQuery.includes("after due date") ||
      lowerQuery.includes("overdue tasks")
    ) {
      result.overdueWork = true;
      if (!keywordsFound.has("overdue")) {
        result.keywords.push("overdue");
        keywordsFound.add("overdue");
      }
    }

    if (
      lowerQuery.includes("finished") ||
      lowerQuery.includes("complete") ||
      lowerQuery.includes("completed") ||
      lowerQuery.includes("done") ||
      lowerQuery.includes("is finished")
    ) {
      result.isFinished = true;
      if (!keywordsFound.has("finished")) {
        result.keywords.push("finished");
        keywordsFound.add("finished");
      }
    }

    if (lowerQuery.includes("status") || lowerQuery.includes("state")) {
      result.projectStatus = true;
      result.taskStatus = true;
      if (!keywordsFound.has("status")) {
        result.keywords.push("status");
        keywordsFound.add("status");
      }
    }

    if (
      lowerQuery.includes("how many employees") ||
      lowerQuery.includes("number of employees") ||
      lowerQuery.includes("employee count")
    ) {
      result.employeeCount = true;
      if (!keywordsFound.has("employees")) {
        result.keywords.push("employees");
        keywordsFound.add("employees");
      }
    }

    if (
      lowerQuery.includes("who all are working") ||
      lowerQuery.includes("employees working") ||
      lowerQuery.includes("workers on project") ||
      lowerQuery.includes("under project") ||
      lowerQuery.includes("working under")
    ) {
      result.assignedEmployees = true;
      if (!keywordsFound.has("employees")) {
        result.keywords.push("employees");
        keywordsFound.add("employees");
      }
    }

    if (
      lowerQuery.includes("hours") &&
      (lowerQuery.includes("by") ||
        lowerQuery.includes("employee") ||
        result.empcode ||
        result.empname)
    ) {
      result.employeeHours = true;
      if (!keywordsFound.has("hours")) {
        result.keywords.push("hours");
        keywordsFound.add("hours");
      }
    }

    if (
      lowerQuery.includes("list") ||
      lowerQuery.includes("all projects") ||
      lowerQuery.includes("show projects")
    ) {
      result.listProjects = true;
      if (!keywordsFound.has("list")) {
        result.keywords.push("list");
        keywordsFound.add("list");
      }
    }

    if (
      lowerQuery.includes("working after the due date") ||
      lowerQuery.includes("work after due") ||
      lowerQuery.includes("who is working after due") ||
      lowerQuery.includes("hours after due")
    ) {
      result.workAfterDue = true;
      if (!keywordsFound.has("after")) {
        result.keywords.push("after");
        keywordsFound.add("after");
      }
    }

    if (
      lowerQuery.includes("completed tasks") ||
      lowerQuery.includes("tasks completed") ||
      lowerQuery.includes("finished tasks")
    ) {
      result.completedTasks = true;
      if (!keywordsFound.has("finished")) {
        result.keywords.push("finished");
        keywordsFound.add("finished");
      }
    }

    if (lowerQuery.includes("severity") || lowerQuery.includes("priority")) {
      result.taskSeverity = true;
      if (!keywordsFound.has("severity")) {
        result.keywords.push("severity");
        keywordsFound.add("severity");
      }
    }

    if (lowerQuery.includes("assigned hours") || lowerQuery.includes("hours assigned")) {
      result.projectAssignedHours = true;
      if (!keywordsFound.has("hours")) {
        result.keywords.push("hours");
        keywordsFound.add("hours");
      }
    }
    const dateRangeRegex =
      /\bfrom\s+(\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+(?:\s+\d{4})?)\s+to\s+(\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+(?:\s+\d{4})?)\b/i;
    const dateRangeMatch = query.match(dateRangeRegex);
    if (dateRangeMatch) {
      const startDateStr = dateRangeMatch[1];
      const endDateStr = dateRangeMatch[2];
      const dateFormats = ["D MMMM YYYY", "D MMMM", "Do MMMM YYYY", "Do MMMM"];
      let startDate: moment.Moment | undefined;
      let endDate: moment.Moment | undefined;

      for (const format of dateFormats) {
        startDate = moment(startDateStr, format, true);
        endDate = moment(endDateStr, format, true);
        if (startDate.isValid() && endDate.isValid()) {
          break;
        }
      }
      if (!startDate?.isValid() || !endDate?.isValid()) {
        const year = moment().year();
        startDate = moment(`${startDateStr} ${year}`, "D MMMM YYYY");
        endDate = moment(`${endDateStr} ${year}`, "D MMMM YYYY");
      }

      if (startDate?.isValid() && endDate?.isValid()) {
        result.dateRange = {
          start: startDate.startOf("day").toDate(),
          end: endDate.endOf("day").toDate()
        };
      } else {
        console.log(`Invalid date range: startDate=${startDateStr}, endDate=${endDateStr}`);
      }
    }

    const dateFormats = [
      "DD-MM-YYYY",
      "YYYY-MM-DD",
      "D MMMM YYYY",
      "D MMMM",
      "Do MMMM YYYY",
      "Do MMMM",
      "MMMM D, YYYY",
      "MMMM D YYYY"
    ];
    const dateCandidates = query.match(
      /\b(\d{1,2}-\d{1,2}-\d{4}|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+(?:\s+\d{4})?|[a-zA-Z]+\s+\d{1,2}(?:,)?\s+\d{4})\b/i
    );
    if (dateCandidates && !result.dateRange) {
      const dateStr = dateCandidates[0];
      let parsedDate;
      for (const format of dateFormats) {
        parsedDate = moment(dateStr, format, true);
        if (parsedDate.isValid()) {
          break;
        }
      }
      if (!parsedDate || !parsedDate.isValid()) {
        const yearMatch = dateStr.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : moment().year();
        const ordinalMatch = dateStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)/i);
        if (ordinalMatch) {
          const day = ordinalMatch[1];
          const month = ordinalMatch[2];
          parsedDate = moment(`${day} ${month} ${year}`, "D MMMM YYYY");
        }
      }
      if (parsedDate && parsedDate.isValid()) {
        result.dates.push(parsedDate.startOf("day").toDate());
      }
    }

    const lastDayMatch = lowerQuery.match(
      /\blast\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
    );
    const thisDayMatch = lowerQuery.match(
      /\bthis\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
    );
    const dayOfWeekMatch = lowerQuery.match(
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
    );

    if (lastDayMatch) {
      const dayName = lastDayMatch[1].toLowerCase();
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];
      const targetDayIndex = daysOfWeek.indexOf(dayName);
      const today = moment().startOf("day");
      const currentDayIndex = today.day();
      const dayDiff = targetDayIndex - currentDayIndex - 7;
      const targetDate = today.clone().add(dayDiff, "days");
      if (targetDate.isValid()) {
        result.dates.push(targetDate.toDate());
      }
    } else if (thisDayMatch) {
      const dayName = thisDayMatch[1].toLowerCase();
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];
      const targetDayIndex = daysOfWeek.indexOf(dayName);
      const today = moment().startOf("day");
      const currentDayIndex = today.day();
      let dayDiff = targetDayIndex - currentDayIndex;
      if (dayDiff < 0) {
        dayDiff += 7;
      }
      const targetDate = today.clone().add(dayDiff, "days");
      if (targetDate.isValid()) {
        result.dates.push(targetDate.toDate());
      }
    } else if (dayOfWeekMatch && !result.dates.length && !result.dateRange) {
      const dayName = dayOfWeekMatch[1].toLowerCase();
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];
      const targetDayIndex = daysOfWeek.indexOf(dayName);
      const today = moment().startOf("day");
      const currentDayIndex = today.day();
      let dayDiff = targetDayIndex - currentDayIndex;
      if (dayDiff <= 0) {
        dayDiff += 7;
      }
      const targetDate = today.clone().add(dayDiff, "days");
      if (targetDate.isValid()) {
        result.dates.push(targetDate.toDate());
      }
    }

    return { success: true, data: result, message: "Query parsed successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || QueryMessages.PARSE.FAILED };
  }
};

export const processEmployeeQuery = async (
  query: string,
  parsedQuery: Record<string, any>
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    console.log("processEmployeeQuery called");
    console.log("Raw Query:", query);
    console.log("Parsed Query:", JSON.stringify(parsedQuery, null, 2));

    let name: string | undefined;
    let empcode: string | undefined;

    if (parsedQuery.empname) {
      name = parsedQuery.empname
        .trim()
        .split(/\s+from\s+/i)[0]
        .trim();
      console.log(`Querying Attendance for empname: ${name}`);
      const attendanceRecords = await Attendance.find({
        empname: { $regex: `^${name}$`, $options: "i" }
      }).lean();
      console.log(`Attendance records for empname: ${attendanceRecords.length}`);
      if (!attendanceRecords.length) {
        return { success: false, message: `No attendance record found for employee ${name}` };
      }
      empcode = attendanceRecords[0].empcode;
      const user = await User.findOne({
        username: { $regex: `^${name}$`, $options: "i" }
      }).lean();
      console.log(`User found for username ${name}: ${!!user}`);
      if (!user) {
        console.warn(`No user found with username ${name}, proceeding with Attendance data`);
      }
    } else if (parsedQuery.empcode) {
      empcode = parsedQuery.empcode.trim();
      console.log(`Querying Attendance for empcode: ${empcode}`);
      const attendanceRecords = await Attendance.find({ empcode }).lean();
      console.log(`Attendance records for empcode: ${attendanceRecords.length}`);
      if (!attendanceRecords.length) {
        return {
          success: false,
          message: `No attendance record found for empcode ${empcode}`
        };
      }
      name = attendanceRecords[0].empname;
      const user = await User.findOne({
        username: { $regex: `^${name}$`, $options: "i" }
      }).lean();
      console.log(`User found for username ${name}: ${!!user}`);
      if (!user) {
        console.warn(`No user found with username ${name}, proceeding with Attendance data`);
      }
    } else {
      console.log("No empname or empcode provided");
      return { success: false, message: "No valid employee identifier provided" };
    }

    let startDate: moment.Moment;
    let endDate: moment.Moment;
    if (parsedQuery.dateRange) {
      startDate = momentTimezone.tz(parsedQuery.dateRange.start, "Asia/Kolkata").startOf("day");
      endDate = momentTimezone.tz(parsedQuery.dateRange.end, "Asia/Kolkata").endOf("day");
    } else if (parsedQuery.dates && parsedQuery.dates[0]) {
      startDate = momentTimezone.tz(parsedQuery.dates[0], "Asia/Kolkata").startOf("day");
      endDate = startDate.clone().endOf("day");
    } else if (parsedQuery.timeRange === "last week") {
      startDate = momentTimezone.tz("Asia/Kolkata").subtract(1, "week").startOf("week");
      endDate = momentTimezone.tz("Asia/Kolkata").subtract(1, "week").endOf("week");
    } else {
      startDate = momentTimezone.tz("Asia/Kolkata").startOf("month");
      endDate = momentTimezone.tz("Asia/Kolkata").endOf("month");
    }

    if (!startDate.isValid() || !endDate.isValid()) {
      console.log("Invalid date format, attempting fallback parsing");
      if (parsedQuery.dateRange) {
        startDate = momentTimezone
          .tz(`${parsedQuery.dateRange.start} 2023`, ["DD MMMM YYYY", "DD-MM-YYYY"], "Asia/Kolkata")
          .startOf("day");
        endDate = momentTimezone
          .tz(`${parsedQuery.dateRange.end} 2023`, ["DD MMMM YYYY", "DD-MM-YYYY"], "Asia/Kolkata")
          .endOf("day");
      } else if (parsedQuery.dates && parsedQuery.dates[0]) {
        startDate = momentTimezone
          .tz(moment(parsedQuery.dates[0]).format("DD-MM-YYYY"), ["DD-MM-YYYY"], "Asia/Kolkata")
          .startOf("day");
        endDate = startDate.clone().endOf("day");
      }
      if (!startDate.isValid() || !endDate.isValid()) {
        return { success: false, message: "Invalid date format provided" };
      }
    }

    console.log(`Date range: ${startDate.format("YYYY-MM-DD")} to ${endDate.format("YYYY-MM-DD")}`);

    const dateStr = parsedQuery.dateRange
      ? `from ${startDate.format("DD MMMM YYYY")} to ${endDate.format("DD MMMM YYYY")}`
      : parsedQuery.dates && parsedQuery.dates[0]
        ? startDate.format("DD MMMM YYYY")
        : parsedQuery.timeRange || "the specified period";

    const queryFilter: any = { empcode, empname: { $regex: `^${name}$`, $options: "i" } };
    if (parsedQuery.dateRange || parsedQuery.dates?.[0] || parsedQuery.timeRange === "last week") {
      queryFilter.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
    }

    console.log("Query filter:", JSON.stringify(queryFilter, null, 2));
    const attendanceRecords = await Attendance.find(queryFilter).sort({ date: 1 }).lean();
    console.log(`Final attendance records: ${attendanceRecords.length}`);

    if (!attendanceRecords.length) {
      return {
        success: false,
        message: `No attendance records found for ${name || empcode} for ${dateStr}`
      };
    }

    const keywords = parsedQuery.keywords || [];
    console.log("Keywords:", keywords);

    if (keywords.includes("workinghours")) {
      const record = attendanceRecords[0];
      if (!record.inTime || !record.outTime) {
        return {
          success: false,
          message: `${name || empcode} has incomplete attendance data on ${dateStr}`
        };
      }
      const inTime = moment(record.inTime, ["HH:mm:ss", "HH:mm"]);
      const outTime = moment(record.outTime, ["HH:mm:ss", "HH:mm"]);
      if (!inTime.isValid() || !outTime.isValid()) {
        return {
          success: false,
          message: `Invalid time format for ${name || empcode} on ${dateStr}`
        };
      }
      const hoursWorked = outTime.diff(inTime, "hours", true).toFixed(2);
      return {
        success: true,
        message: `${name || empcode} worked ${hoursWorked} hours on ${dateStr}`
      };
    }

    if (keywords.includes("details")) {
      let response = `Attendance info for ${name || empcode} ${dateStr}:\n`;
      attendanceRecords.forEach((record: any) => {
        const recordDate = momentTimezone.tz(record.date, "Asia/Kolkata").format("DD MMMM YYYY");
        response += `${recordDate}: Status=${record.status || "Not recorded"}, In=${record.inTime || "Not recorded"}, Out=${record.outTime || "Not recorded"}, Minutes Late=${record.minutesLate ?? "0"}\n`;
      });
      return { success: true, message: response.trim() };
    }

    if (keywords.includes("absent")) {
      const record = attendanceRecords[0];
      if (!record.status) {
        return {
          success: false,
          message: `${name || empcode} has no attendance status recorded on ${dateStr}`
        };
      }
      const isAbsent = record.status.toLowerCase() === "absent";
      return {
        success: true,
        message: `${name || empcode} was ${isAbsent ? "absent" : "not absent"} on ${dateStr}`
      };
    }

    if (
      (parsedQuery.averageInTime && parsedQuery.averageOutTime) ||
      (keywords.includes("average") && keywords.includes("intime") && keywords.includes("outtime"))
    ) {
      const query: any = {
        empcode,
        empname: { $regex: `^${name}$`, $options: "i" },
        status: { $nin: ["Absent", "None"] },
        inTime: { $ne: null },
        outTime: { $ne: null }
      };
      if (
        parsedQuery.dateRange ||
        parsedQuery.dates?.[0] ||
        parsedQuery.timeRange === "last week"
      ) {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      }
      const records = await Attendance.find(query).lean();
      if (!records.length) {
        return {
          success: false,
          message: `${name || empcode} has no valid attendance records for ${dateStr}`
        };
      }
      const inTimes = records
        .map((r: any) => {
          const time = moment.utc(r.inTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : null;
        })
        .filter((t: number | null): t is number => t !== null);
      const outTimes = records
        .map((r: any) => {
          const time = moment.utc(r.outTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : null;
        })
        .filter((t: number | null): t is number => t !== null);
      const avgInTime = inTimes.length
        ? moment
            .utc((inTimes.reduce((a: number, b: number) => a + b, 0) / inTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      const avgOutTime = outTimes.length
        ? moment
            .utc((outTimes.reduce((a: number, b: number) => a + b, 0) / outTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      return {
        success: true,
        message: `${name || empcode}'s average in-time is ${avgInTime} and out-time is ${avgOutTime} for ${dateStr}`
      };
    }

    if (keywords.includes("attendance") || keywords.includes("show")) {
      let response = `Attendance for ${name || empcode} ${dateStr}:\n`;
      attendanceRecords.forEach((record: any) => {
        const recordDate = momentTimezone.tz(record.date, "Asia/Kolkata").format("DD MMMM YYYY");
        response += `${recordDate}: Status=${record.status || "Not recorded"}, In=${record.inTime || "Not recorded"}, Out=${record.outTime || "Not recorded"}, Minutes Late=${record.minutesLate ?? "0"}\n`;
      });
      return { success: true, message: response.trim() };
    }

    if (keywords.includes("late") || parsedQuery.hoursLate) {
      const record = attendanceRecords[0];
      if (record.minutesLate === undefined || record.minutesLate === null) {
        return {
          success: false,
          message: `${name || empcode} has no late minutes recorded on ${dateStr}`
        };
      }
      return {
        success: true,
        message: `${name || empcode} was ${record.minutesLate} minutes late on ${dateStr}`
      };
    }

    if (keywords.includes("intime") && keywords.includes("outtime")) {
      const record = attendanceRecords[0];
      const inTime = record.inTime || "Not recorded";
      const outTime = record.outTime || "Not recorded";
      return {
        success: true,
        message: `${name || empcode}'s in-time on ${dateStr} was ${inTime}, out-time was ${outTime}`
      };
    }

    if (parsedQuery.averageOutTime && !parsedQuery.averageInTime) {
      const query: any = {
        empcode,
        empname: { $regex: `^${name}$`, $options: "i" },
        status: { $nin: ["Absent", "None"] },
        outTime: { $ne: null }
      };
      if (
        parsedQuery.dateRange ||
        parsedQuery.dates?.[0] ||
        parsedQuery.timeRange === "last week"
      ) {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      }
      const records = await Attendance.find(query).lean();
      if (!records.length) {
        return {
          success: false,
          message: `${name || empcode} has no valid out-time records for ${dateStr}`
        };
      }
      const outTimes = records
        .map((r: any) => {
          const time = moment.utc(r.outTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : null;
        })
        .filter((t: number | null): t is number => t !== null);
      const avgOutTime = outTimes.length
        ? moment
            .utc((outTimes.reduce((a: number, b: number) => a + b, 0) / outTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      return {
        success: true,
        message: `${name || empcode}'s average out-time is ${avgOutTime} for ${dateStr}`
      };
    }

    if (parsedQuery.averageInTime && !parsedQuery.averageOutTime) {
      const query: any = {
        empcode,
        empname: { $regex: `^${name}$`, $options: "i" },
        status: { $nin: ["Absent", "None"] },
        inTime: { $ne: null }
      };
      if (
        parsedQuery.dateRange ||
        parsedQuery.dates?.[0] ||
        parsedQuery.timeRange === "last week"
      ) {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      }
      const records = await Attendance.find(query).lean();
      if (!records.length) {
        return {
          success: false,
          message: `${name || empcode} has no valid in-time records for ${dateStr}`
        };
      }
      const inTimes = records
        .map((r: any) => {
          const time = moment.utc(r.inTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : null;
        })
        .filter((t: number | null): t is number => t !== null);
      const avgInTime = inTimes.length
        ? moment
            .utc((inTimes.reduce((a: number, b: number) => a + b, 0) / inTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      return {
        success: true,
        message: `${name || empcode}'s average in-time is ${avgInTime} for ${dateStr}`
      };
    }

    if (keywords.includes("outtime") && !keywords.includes("intime")) {
      const record = attendanceRecords[0];
      if (!record.outTime) {
        return {
          success: false,
          message: `${name || empcode} has no out-time recorded on ${dateStr}`
        };
      }
      return {
        success: true,
        message: `${name || empcode}'s out-time on ${dateStr} was ${record.outTime}`
      };
    }

    if (keywords.includes("intime") && !keywords.includes("outtime")) {
      const record = attendanceRecords[0];
      if (!record.inTime) {
        return {
          success: false,
          message: `${name || empcode} has no in-time recorded on ${dateStr}`
        };
      }
      return {
        success: true,
        message: `${name || empcode}'s in-time on ${dateStr} was ${record.inTime}`
      };
    }

    if (keywords.includes("after10am")) {
      const record = attendanceRecords[0];
      if (!record.inTime) {
        return {
          success: false,
          message: `${name || empcode} has no in-time recorded on ${dateStr}`
        };
      }
      const inTime = moment(record.inTime, ["HH:mm:ss", "HH:mm"]);
      const isLate = inTime.isAfter(moment("10:00", "HH:mm"));
      return {
        success: true,
        message: `${name || empcode} ${isLate ? "logged in after 10:00 AM" : "did not log in after 10:00 AM"} on ${dateStr}`
      };
    }

    if (keywords.includes("latelogoff")) {
      const record = attendanceRecords[0];
      if (!record.outTime) {
        return {
          success: false,
          message: `${name || empcode} has no out-time recorded on ${dateStr}`
        };
      }
      const outTime = moment(record.outTime, ["HH:mm:ss", "HH:mm"]);
      const isLate = outTime.isAfter(moment("19:00", "HH:mm"));
      return {
        success: true,
        message: `${name || empcode} ${isLate ? "logged off after 7:00 PM" : "did not log off after 7:00 PM"} on ${dateStr}`
      };
    }

    console.log("No matching query handler");
    return {
      success: false,
      message: `Please specify a valid attendance query for ${name || empcode}`
    };
  } catch (error: any) {
    console.error("Error in processEmployeeQuery:", error.message, error.stack);
    return { success: false, message: `Failed to process query: ${error.message}` };
  }
};

export const processQuery = async (
  query: string,
  conversationId?: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    if (!query || typeof query !== "string") {
      return { success: false, message: QueryMessages.PROCESS.REQUIRED };
    }

    const parseResult = await parseQuery(query);
    if (!parseResult.success || !parseResult.data) {
      return { success: false, message: parseResult.message };
    }
    const parsedQuery = parseResult.data;

    let response: { success: boolean; data?: any; message?: string };
    let queryType: IQueryHistory["type"];

    const attendanceKeywords = [
      "intime",
      "outtime",
      "clockin",
      "clockout",
      "clocked",
      "clockedin",
      "clockedout",
      "absent",
      "late",
      "attendance",
      "average",
      "workinghours",
      "after10am",
      "latelogoff"
    ];
    const taskKeywords = [
      "task",
      "tasks",
      "project",
      "overdue",
      "status",
      "severity",
      "due",
      "hours",
      "completed",
      "open",
      "uncompleted",
      "assigned"
    ];

    const lowerQuery = query.toLowerCase();

    if (
      parsedQuery.project_name ||
      parsedQuery.taskName ||
      parsedQuery.organizationName ||
      parsedQuery.assignedEmployees ||
      parsedQuery.openTasks ||
      parsedQuery.completedTasks ||
      parsedQuery.taskDetails ||
      parsedQuery.projectAssignedHours ||
      parsedQuery.dueDate ||
      parsedQuery.projectStatus ||
      parsedQuery.isFinished ||
      parsedQuery.hoursSpent ||
      parsedQuery.workAfterDue ||
      parsedQuery.taskStatus ||
      parsedQuery.taskSeverity ||
      parsedQuery.employeeHours ||
      parsedQuery.overdueWork ||
      parsedQuery.projectDetails ||
      parsedQuery.organizationDetails ||
      taskKeywords.some((keyword) => lowerQuery.includes(keyword))
    ) {
      queryType = "task";
      response = await queryTaskService.processTaskQuery(query, parsedQuery);
    } else if (
      parsedQuery.employeeDetails ||
      (parsedQuery.empname &&
        lowerQuery.includes("info") &&
        !attendanceKeywords.some((keyword) => lowerQuery.includes(keyword)) &&
        !taskKeywords.some((keyword) => lowerQuery.includes(keyword)))
    ) {
      queryType = "combined";
      response = await userService.processQuery(query, parsedQuery);
    } else if (
      parsedQuery.isAttendanceQuery ||
      parsedQuery.empcode ||
      parsedQuery.hoursLate ||
      parsedQuery.averageInTime ||
      parsedQuery.averageOutTime ||
      parsedQuery.workinghours ||
      parsedQuery.after10am ||
      parsedQuery.latelogoff ||
      attendanceKeywords.some((keyword) => lowerQuery.includes(keyword))
    ) {
      queryType = "attendance";
      if (
        (parsedQuery.empname || parsedQuery.empcode) &&
        (parsedQuery.dates?.length ||
          parsedQuery.dateRange ||
          parsedQuery.timeRange ||
          parsedQuery.keywords?.some((k: any) =>
            [
              "intime",
              "outtime",
              "late",
              "absent",
              "attendance",
              "workinghours",
              "after10am",
              "latelogoff"
            ].includes(k)
          ) ||
          parsedQuery.averageInTime ||
          parsedQuery.averageOutTime ||
          parsedQuery.hoursLate)
      ) {
        response = await processEmployeeQuery(query, parsedQuery);
      } else {
        response = await attendanceService.processQuery(query, parsedQuery);
      }
    } else {
      queryType = "combined";
      response = {
        success: false,
        message:
          "Invalid query: Please specify details for project, organization, task, or attendance information."
      };
    }

    if (!response.message) {
      return { success: false, message: "Invalid or empty response from service" };
    }

    const finalConversationId = conversationId || new Types.ObjectId().toString();

    await createQueryHistory({
      id: new Types.ObjectId().toString(),
      query,
      timestamp: new Date(),
      parsedQuery,
      response: response.message,
      conversationId: finalConversationId,
      type: queryType
    } as any);

    return response;
  } catch (error: any) {
    return { success: false, message: error.message || QueryMessages.PROCESS.FAILED };
  }
};

export const getQueryHistory = async (
  limit: number = 10
): Promise<{ success: boolean; data?: IQueryHistory[]; message?: string }> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/yourDatabase", {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000
      });
      console.log("MongoDB reconnected successfully for query history");
    }

    if (limit < 1 || limit > 100) {
      return { success: false, message: "Limit must be between 1 and 100" };
    }

    const history = await findQueryHistory(limit);
    return { success: true, data: history, message: "Query history retrieved successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || QueryMessages.HISTORY.FAILED };
  }
};

export const clearQueryHistory = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return { success: false, message: "Database connection is not established" };
    }

    await deleteAllQueryHistory();
    return { success: true, message: "Query history cleared successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || QueryMessages.CLEAR.FAILED };
  }
};

export const deleteConversation = async (
  conversationId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return { success: false, message: "Database connection is not established" };
    }

    if (!conversationId || typeof conversationId !== "string") {
      return { success: false, message: "Conversation ID must be a non-empty string" };
    }

    await deleteQueryHistoryByConversationId(conversationId);
    return { success: true, message: "Conversation deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || QueryMessages.DELETE.FAILED };
  }
};

export default {
  parseQuery,
  processQuery,
  processEmployeeQuery,
  getQueryHistory,
  clearQueryHistory,
  deleteConversation
};
