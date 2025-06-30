import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, styled } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { GetMeResponse } from "@/app/actions/auth/getMe";
import { getMenusByRole, UserRole } from "@/config/menu";
import BlueLogo from "@/public/images/logo/blue-logo.png";

interface IProps {
  me: GetMeResponse;
}

export default function SideBar(props: IProps) {
  const { me } = props;
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (path: string) => {
    setOpenMenu((prev) => (prev === path ? null : path));
  };

  return (
    <Wrapper>
      <Logo src={BlueLogo.src} alt="logo" />

      <Menus>
        {getMenusByRole(me?.data?.type as UserRole).map((el) => {
          const isOpen = openMenu === el.path;

          return (
            <Box key={el.label} sx={{ width: "100%" }}>
              <SingleMenu onClick={() => toggleMenu(el.path)}>
                <IconLabel>
                  <el.icon />
                  {el.label}
                </IconLabel>
                <Arrow animate={{ rotate: isOpen ? 0 : 180 }} />
              </SingleMenu>

              <AnimatePresence initial={false}>
                {isOpen && el.children && el.children.length > 0 && (
                  <ChildMenuWrap
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {el.children.map((child) => (
                      <ChildItem key={child.path}>{child.label}</ChildItem>
                    ))}
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
  gap: "48px",
  width: "100%",
  display: "flex",
  padding: "24px",
  maxWidth: "240px",
  alignItems: "start",
  minHeight: "100dvh",
  flexDirection: "column",
  justifyContent: "start",
  borderRight: "1px solid #d9d9d9",
}));

const Logo = styled("img")(() => ({
  width: "180px",
}));

const Menus = styled(Box)(() => ({
  gap: "32px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "start",
}));

const SingleMenu = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "space-between",
}));

const IconLabel = styled(Box)(() => ({
  gap: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
}));

const Arrow = styled(motion(KeyboardArrowDownRoundedIcon))(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  transform: "rotate(180deg)",
}));

// const ChildMenuWrap = styled(motion.div)(() => ({
//   gap: "8px",
//   display: "flex",
//   marginTop: "12px",
//   overflow: "hidden",
//   paddingLeft: "40px",
//   flexDirection: "column",
// }));

const ChildMenuWrap = styled(motion.div)(() => ({
  paddingLeft: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  overflow: "hidden",
}));

const ChildItem = styled(Box)(() => ({
  fontSize: "14px",
  color: "#555",
  cursor: "pointer",
  "&:hover": {
    color: "red",
  },
}));
