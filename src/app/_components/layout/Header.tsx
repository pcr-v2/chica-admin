"use client";

import { Box, styled } from "@mui/material";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { signOut } from "@/app/actions/auth/SignOutAction";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import {
  getCurrentMenuItem,
  getCurrentMenuLabel,
  UserRole,
} from "@/config/menu";
import LogoutIcon from "@/public/images/icons/header/header-logout.svg";

interface IProps {
  me: GetMeResponse;
}

export default function Header(props: IProps) {
  const { me } = props;
  const nowPath = usePathname();
  // console.log("me", me);

  const handleLogout = async () => {
    toast.success("로그아웃 되었습니다.");
    await signOut();
  };

  const lable = getCurrentMenuLabel(nowPath, me?.data?.type as UserRole);

  const currentMenu = getCurrentMenuItem(nowPath, me?.data?.type as UserRole);
  const Icon = currentMenu?.icon;

  return (
    <Wrapper>
      <PathLabel>
        {Icon && (
          <IconWrapper>
            <Icon />
          </IconWrapper>
        )}
        {lable}
      </PathLabel>

      <UserMenu>
        <UserName>
          {me?.data?.type === "master" && "관리자"}
          {me?.data?.name}-선생님
        </UserName>
        <Logout onClick={handleLogout} />
      </UserMenu>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "28px 0px 12px",
    backgroundColor: "#F7F8FA",
    justifyContent: "space-between",
  };
});

const UserMenu = styled(Box)(() => {
  return {
    gap: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const PathLabel = styled("span")(() => {
  return {
    fontSize: 24,
    fontWeight: 500,
    display: "flex",
    color: "#464B53",
    alignItems: "center",
    letterSpacing: "-0.18px",
  };
});

const UserName = styled("span")(() => {
  return {
    fontSize: 22,
    fontWeight: 600,
    color: "#747D8A",
  };
});

const Logout = styled(LogoutIcon)(() => {
  return {
    width: "28px",
    height: "28px",
    path: { fill: "#464B53" },
    cursor: "pointer",
  };
});

const IconWrapper = styled("span")({
  marginRight: "12px",
  alignItems: "center",
  display: "inline-flex",
  svg: {
    width: 32,
    height: 32,
  },
  path: {
    fill: "#464B53",
  },
});
