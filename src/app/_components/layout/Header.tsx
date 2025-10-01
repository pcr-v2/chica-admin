"use client";

import { Box, styled } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Toggle } from "@/app/_components/common/Toggle";
import { convertGrant } from "@/app/actions/auth/ConvertGrantAction";
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
  const router = useRouter();

  const [value, setValue] = useState({
    checked: me?.data?.type === "master" || false,
    grant: me?.data?.type || "teacher",
  });

  const handleLogout = async () => {
    toast.success("로그아웃 되었습니다.");
    await signOut();
  };

  const lable = getCurrentMenuLabel(nowPath, me?.data?.type as UserRole);

  const currentMenu = getCurrentMenuItem(nowPath, me?.data?.type as UserRole);
  const Icon = currentMenu?.icon;

  // const convertGrantAvailable =
  //   me &&
  //   me?.data &&
  //   nowPath === "/dashboard" &&
  //   me.data?.schoolId === "21a01ae2-2f60-4f7c-bcae-9fa4fc287564";

  // const handleGrant = async (v: boolean) => {
  //   if (!me.data) return;

  //   const res = await convertGrant({
  //     id: "dev",
  //     pw: "1q2w3e4r!",
  //     schoolId: me.data.schoolId,
  //     schoolType: v ? "master" : "teacher",
  //   });

  //   if (res.code === "FAIL") {
  //     toast.error(res.message);
  //     return;
  //   }

  //   toast.success("권한이 변경되었습니다.");

  //   // 토글 상태만 v로 업데이트
  //   setValue({
  //     checked: v,
  //     grant: v ? "master" : "teacher",
  //   });

  //   // 권한 바뀌면 새 토큰 발급되므로 필요 시 refresh
  //   router.refresh();
  // };

  // console.log("value", value);

  return (
    <Wrapper>
      <PathLabel>
        {Icon &&
          (nowPath === "/logs" ? (
            <LogsIconWrapper>
              <Icon />
            </LogsIconWrapper>
          ) : (
            <IconWrapper>
              <Icon />
            </IconWrapper>
          ))}
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

const Wrapper = styled(Box)(({ theme }) => {
  return {
    width: "100%",
    display: "flex",
    padding: "28px 0px 12px",
    backgroundColor: "#F7F8FA",
    justifyContent: "space-between",
    [theme.breakpoints.down("desktop")]: {
      flexWrap: "wrap",
      padding: "24px 0px 8px",
    },
  };
});

const UserMenu = styled(Box)(({ theme }) => {
  return {
    gap: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("desktop")]: {
      gap: "4px",
    },
  };
});

const PathLabel = styled("span")(({ theme }) => {
  return {
    fontSize: 24,
    fontWeight: 500,
    display: "flex",
    color: "#464B53",
    alignItems: "center",
    letterSpacing: "-0.18px",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 16,
      letterSpacing: "-0.2px",
    },
  };
});

const UserName = styled("span")(({ theme }) => {
  return {
    fontSize: 22,
    fontWeight: 600,
    color: "#747D8A",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 16,
      fontWeight: 500,
    },
  };
});

const Logout = styled(LogoutIcon)(({ theme }) => {
  return {
    width: "28px",
    height: "28px",
    cursor: "pointer",
    path: { fill: "#464B53" },
    [theme.breakpoints.down("desktop")]: {
      width: "20px",
      height: "20px",
    },
  };
});

const LogsIconWrapper = styled("span")(({ theme }) => {
  return {
    marginRight: "12px",
    alignItems: "center",
    display: "inline-flex",
    svg: {
      width: 32,
      height: 32,
    },
    path: {
      stroke: "#464B53",
    },
    [theme.breakpoints.down("desktop")]: {
      marginRight: "4px",
      svg: {
        width: 20,
        height: 20,
      },
    },
  };
});

const IconWrapper = styled("span")(({ theme }) => {
  return {
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
    [theme.breakpoints.down("desktop")]: {
      marginRight: "4px",
      svg: {
        width: 20,
        height: 20,
      },
    },
  };
});
