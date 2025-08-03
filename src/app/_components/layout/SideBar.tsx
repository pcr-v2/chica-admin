import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, styled } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { GetMeResponse } from "@/app/actions/auth/getMe";
import { getMenusByRole, MenuItem, UserRole } from "@/config/menu";
import SideArrow from "@/public/images/icons/sidebar/side-arrow.svg";
import SideLogo from "@/public/images/logo/side-logo.svg";

interface IProps {
  me: GetMeResponse;
}

export default function SideBar(props: IProps) {
  const { me } = props;

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const router = useRouter();
  const nowPath = usePathname();

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
        <Logo />

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

          return (
            <Box key={parentMenu.label} sx={{ width: "100%" }}>
              <SingleMenuWrap
                onClick={() => toggleMenu(parentMenu)}
                isactive={isActive.toString()}
              >
                <IconLabel sx={{}}>
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
                  <ParentMenu isactive={isActive.toString()}>
                    {parentMenu.label}
                  </ParentMenu>
                </IconLabel>

                {parentMenu.children && parentMenu.children.length > 0 && (
                  <Arrow
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </SingleMenuWrap>

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
                              {child.label}
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

const Wrapper = styled(Box)(() => ({
  gap: "28px",
  width: "100%",
  display: "flex",
  maxWidth: "243px",
  // alignItems: "start",
  // minHeight: "100dvh",
  padding: "28px 24px",
  flexDirection: "column",
  // justifyContent: "start",
}));

const LogoWrap = styled(Box)(() => {
  return {
    gap: "12px",
    display: "flex",
    alignItems: "center",
  };
});

const Logo = styled(SideLogo)(() => ({
  width: "28px",
  height: "28px",
}));

const LogoText = styled("span")(() => {
  return {
    fontSize: 24,
    fontWeight: 500,
    color: "#32C794",
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

const SingleMenuWrap = styled(Box)<{ isactive: string }>(({ isactive }) => ({
  width: "100%",
  display: "flex",
  cursor: "pointer",
  borderRadius: "8px",
  alignItems: "center",
  padding: "10px 8px 10px 12px",
  backgroundColor: isactive === "true" ? "#EDFCF7" : "#fff",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "#EDFCF7",
  },
}));

const ParentMenu = styled(Box)<{ isactive: string }>(({ isactive }) => {
  return {
    fontSize: 18,
    fontWeight: 400,
    color: isactive === "true" ? "#13BA81" : "#747D8A",
  };
});

const IconLabel = styled(Box)(() => ({
  gap: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
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

const StyledIcon = styled("svg", {
  shouldForwardProp: (prop) => prop !== "isactive",
})<{ isactive: string }>(({ isactive }) => ({
  width: "32px",
  height: "32px",
  path: {
    fill: isactive === "true" ? "#13BA81" : "#747D8A",
  },
  transition: "0.2s ease",
}));
