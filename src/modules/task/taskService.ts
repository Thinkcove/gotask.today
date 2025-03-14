import { ITask } from "../../domain/interface/task";
import { Task } from "../../domain/model/task";

export class TaskService {
  // Create a new task
  static async createTask(taskData: ITask): Promise<ITask> {
    const newTask = new Task(taskData);
    return await newTask.save();
  }

  // Get all tasks
  static async getAllTasks(): Promise<ITask[]> {
    return await Task.find(); // Fetches all tasks
  }
}
