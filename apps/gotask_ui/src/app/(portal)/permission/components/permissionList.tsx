import React, { useState, useMemo } from "react";
import { Grid, Box, Typography, Divider, Stack, CircularProgress } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import useSWR from "swr";
import { fetchAllgetpermission } from "../services/permissionAction";
import SearchBar from "@/app/component/searchBar/searchBar";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { PermissionData, PermissionListProps } from "../interface/interface";
import { PermissionItem } from "./permissionItem";
import CommonGridList from "./commonGridList";
import { useUser } from "@/app/userContext";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const PermissionList = () => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const { data, isLoading, error } = useSWR("getpermission", fetchAllgetpermission, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  const [searchTerm, setSearchTerm] = useState("");

  const onSearchChange = (val: string) => {
    setSearchTerm(val);
  };
  const router = useRouter();
  const { user } = useUser();

  const handleCreatePermission = () => {
    if (user?.id) {
      router.push(`/permission/createPremission/${user.id}`);
    }
  };

  const filteredPermissions = useMemo(() => {
    if (!data) return [];
    return data.filter((perm: PermissionData) =>
      perm.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }
  const handlePrimessionView = (permissionId: string) => {
    router.push(`/permission/view/${permissionId}`);
  };
  return (
    <>
      <Box sx={{ width: "100%", pt: 4 }}>
        <Box
          sx={{
            pr: 2,
            pl: 2,
            flexGrow: 1,
            pb: 2,
            maxWidth: { xs: "none", sm: 400 },
            minWidth: { xs: "auto", sm: 200 }
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            sx={{ width: "100%" }}
            placeholder={transpermishion("search")}
          />
        </Box>
        <CommonGridList<PermissionData>
          items={filteredPermissions}
          noDataMessage={
            <EmptyState imageSrc={NoAssetsImage} message={transpermishion("nodatafound")} />
          }
          renderItem={(permission) => (
            <PermissionItem permission={permission} onClick={handlePrimessionView} />
          )}
        />
      </Box>
      <ActionButton
        label={"Create Permission"}
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={handleCreatePermission}
      />
    </>
  );
};

export default PermissionList;
