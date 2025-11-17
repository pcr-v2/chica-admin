import { Box, styled, Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { GetMeResponse } from "@/app/actions/auth/getMe";
import { getMenusByRole, MenuItem, UserRole } from "@/config/menu";
import useResponsive from "@/libs/hooks/useResponsive";
import SideLogo from "@/public/images/icons/sidebar/logo.svg";
import SideArrow from "@/public/images/icons/sidebar/side-arrow.svg";

interface IProps {
  me: GetMeResponse;
}

export default function SideBar(props: IProps) {
  const { me } = props;

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const router = useRouter();
  const nowPath = usePathname();
  const downDesktop = useResponsive("down", "desktop");

  const toggleMenu = (el: MenuItem) => {
    if (el.children && el.children?.length <= 0) {
      router.push(el.path);
      return;
    }
    setOpenMenu((prev) => (prev === el.path ? null : el.path));
  };

  return (
    <Wrapper>
      <LogoWrap>
        <Logo src={SideLogo} alt="logo" />

        <LogoText>양치킹</LogoText>
      </LogoWrap>
      <Menus>
        {getMenusByRole(me?.data?.type as UserRole).map((parentMenu) => {
          const Icon = parentMenu.icon;

          const isActive = nowPath === parentMenu.path;

          const isOpen =
            openMenu === parentMenu.path ||
            parentMenu.children?.some(
              (child) =>
                nowPath === child.path || nowPath.startsWith(child.path),
            );

          const menuContent = (
            <SingleMenuWrap
              onClick={() => toggleMenu(parentMenu)}
              isactive={isActive.toString()}
            >
              <IconLabel sx={{}}>
                {Icon &&
                  (parentMenu.path === "/logs" ||
                  parentMenu.path === "/statistic" ? (
                    <StyledLogsIcon isactive={isActive.toString()}>
                      <Icon
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </StyledLogsIcon>
                  ) : (
                    <StyledIcon isactive={isActive.toString()}>
                      <Icon
                        style={{
                          zIndex: 3,
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                      />

                      {downDesktop &&
                        parentMenu.label === "고객센터" &&
                        me.data &&
                        me.data?.countUnAnswerCount > 0 && (
                          <UnAnswerBox>
                            {me.data?.countUnAnswerCount}
                          </UnAnswerBox>
                        )}
                    </StyledIcon>
                  ))}
                <ParentMenu isactive={isActive.toString()}>
                  <SideBarText>
                    {parentMenu.label}

                    {parentMenu.label === "고객센터" &&
                      me.data &&
                      me.data?.countUnAnswerCount > 0 && (
                        <UnAnswerBox>{me.data?.countUnAnswerCount}</UnAnswerBox>
                      )}
                  </SideBarText>
                </ParentMenu>
              </IconLabel>
              {parentMenu.children && parentMenu.children.length > 0 && (
                <Arrow
                  animate={{ rotate: isOpen ? 0 : 180 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </SingleMenuWrap>
          );

          return (
            <Box key={parentMenu.label} sx={{ width: "100%" }}>
              {downDesktop ? (
                <Tooltip
                  title={parentMenu.label}
                  placement="right"
                  // arrow
                  followCursor
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontSize: 14,
                        padding: "8px",
                        fontWeight: 600,
                        color: "#fff",
                        marginTop: "4px",
                        borderRadius: "8px",
                        bgcolor: "#32C794",
                      },
                    },
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 14],
                          },
                        },
                      ],
                    },
                  }}
                >
                  {menuContent}
                </Tooltip>
              ) : (
                menuContent
              )}

              <AnimatePresence initial={false}>
                {isOpen &&
                  parentMenu.children &&
                  parentMenu.children.length > 0 && (
                    <ChildMenuWrap
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          marginTop: "8px",
                          flexDirection: "column",
                        }}
                      >
                        {parentMenu.children.map((child) => {
                          const Icon = child.icon;

                          const isActive = nowPath === child.path;

                          return (
                            <ChildItem
                              key={child.path}
                              isactive={(nowPath === child.path).toString()}
                              onClick={() => router.push(child.path)}
                            >
                              {Icon && (
                                <StyledIcon isactive={isActive.toString()}>
                                  <Icon
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                    }}
                                  />
                                </StyledIcon>
                              )}
                              <span>{child.label}</span>
                            </ChildItem>
                          );
                        })}
                      </Box>
                    </ChildMenuWrap>
                  )}
              </AnimatePresence>
            </Box>
          );
        })}
      </Menus>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => ({
  gap: "28px",
  width: "100%",
  display: "flex",
  maxWidth: "243px",
  minHeight: "100dvh",
  padding: "28px 24px",
  flexDirection: "column",
  [theme.breakpoints.down("desktop")]: {
    maxWidth: "72px",
    padding: "24px 10px",
  },
}));

const LogoWrap = styled(Box)(({ theme }) => {
  return {
    gap: "12px",
    display: "flex",
    alignItems: "end",
    padding: "9px 0px 9px 8px",
    [theme.breakpoints.down("desktop")]: {
      padding: "8px",
    },
  };
});

const Logo = styled(Image)(({ theme }) => ({
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  [theme.breakpoints.down("desktop")]: {
    // width: "40px",
    // height: "40px",
    margin: "auto",
  },
}));

const LogoText = styled("span")(({ theme }) => {
  return {
    fontSize: 28,
    display: "flex",
    fontWeight: 600,
    color: "#32C794",
    lineHeight: "100%",
    [theme.breakpoints.down("desktop")]: {
      display: "none",
    },
  };
});

const Menus = styled(Box)(() => ({
  gap: "12px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "start",
}));

const SingleMenuWrap = styled(Box)<{ isactive: string }>(
  ({ isactive, theme }) => ({
    width: "100%",
    display: "flex",
    cursor: "pointer",
    borderRadius: "8px",
    alignItems: "center",
    padding: "10px 8px 10px 12px",
    justifyContent: "space-between",
    backgroundColor: isactive === "true" ? "#EDFCF7" : "#fff",
    "&:hover": {
      backgroundColor: "#EDFCF7",
    },
    [theme.breakpoints.down("desktop")]: {
      margin: "auto",
      padding: "8px",
      backgroundColor: isactive === "true" ? "#32C794" : "#fff",
      "&:hover": {
        backgroundColor: isactive === "true" ? "#32C794" : "#EDFCF7",
      },
    },
  }),
);

const ParentMenu = styled(Box)<{ isactive: string }>(({ isactive }) => {
  return {
    fontSize: 18,
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    color: isactive === "true" ? "#13BA81" : "#747D8A",
  };
});

const IconLabel = styled(Box)(({ theme }) => ({
  gap: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  [theme.breakpoints.down("desktop")]: {
    gap: "0px",
    width: "32px",
    margin: "auto",
  },
}));

const Arrow = styled(motion.create(SideArrow))(() => ({
  width: "20px",
  height: "20px",
  cursor: "pointer",
}));

const ChildMenuWrap = styled(motion.create("div"))(() => ({
  gap: "8px",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
}));

const ChildItem = styled(Box)<{ isactive: string }>(({ isactive }) => ({
  gap: "4px",
  fontSize: 18,
  fontWeight: 400,
  display: "flex",
  cursor: "pointer",
  borderRadius: "8px",
  alignItems: "center",
  padding: "10px 8px 10px 44px",
  color: isactive === "true" ? "#13BA81" : "#747D8A",
  "&:hover": {
    backgroundColor: "#EDFCF7",
  },
}));

const StyledLogsIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isactive",
})<{ isactive: string }>(({ isactive, theme }) => ({
  width: "28px",
  height: "28px",
  path: {
    stroke: isactive === "true" ? "#13BA81" : "#747D8A",
    fill: "#fff",
  },
  transition: "0.2s ease",
  [theme.breakpoints.down("desktop")]: {
    width: "32px",
    height: "32px",
  },
}));

const StyledIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isactive",
})<{ isactive: string }>(({ isactive, theme }) => ({
  width: "28px",
  height: "28px",
  path: {
    fill: isactive === "true" ? "#13BA81" : "#747D8A",
  },
  transition: "0.2s ease",
  [theme.breakpoints.down("desktop")]: {
    zIndex: 1,
    width: "40px",
    height: "40px",
    position: "relative", // 부모 기준점
    path: {
      fill: isactive === "true" ? "#fff" : "#747D8A",
    },
  },
}));

const SideBarText = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("desktop")]: {
      display: "none",
    },
  };
});

const UnAnswerBox = styled(Box)(({ theme }) => {
  return {
    fontSize: 14,
    width: "24px",
    padding: "4px",
    height: "24px",
    fontWeight: 500,
    display: "flex",
    marginLeft: "8px",
    color: "#EF5350",
    borderRadius: "8px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFEBEE",
    [theme.breakpoints.down("desktop")]: {
      top: -4,
      left: 12,
      zIndex: 2,
      position: "absolute",
    },
  };
});
