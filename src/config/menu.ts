import { FunctionComponent, ReactNode, SVGProps } from "react";

import SideContents from "@/public/images/icons/sidebar/side-contents.svg";
import SideCs from "@/public/images/icons/sidebar/side-cs.svg";
import SideHome from "@/public/images/icons/sidebar/side-home.svg";
import SideLogs from "@/public/images/icons/sidebar/side-logs.svg";
import SideMypage from "@/public/images/icons/sidebar/side-mypage.svg";
import SideSchedule from "@/public/images/icons/sidebar/side-schedule.svg";
import SideSchool from "@/public/images/icons/sidebar/side-school.svg";
import SideStudent from "@/public/images/icons/sidebar/side-student.svg";

// ✅ 1. 사용자 타입 정의
export type UserRole = "master" | "teacher";

// ✅ 2. 메뉴 타입 정의
export interface MenuItem {
  label: string;
  path: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  allowRoles: UserRole[];
  children?: MenuItem[];
}

// ✅ 3. 메뉴 구성
export const MENUS: MenuItem[] = [
  // 🔹 마스터 전용 메뉴
  // {
  //   label: "회원관리",
  //   path: "/member",
  //   icon: PeopleIcon, // ex) <PersonIcon />
  //   allowRoles: ["master"],
  //   children: [
  //     {
  //       label: "회원 리스트",
  //       path: "/member/list",
  //       icon: null,
  //       allowRoles: ["master"],
  //     },
  //     {
  //       label: "신규회원 등록",
  //       path: "/member/add",
  //       icon: null,
  //       allowRoles: ["master"],
  //     },
  //   ],
  // },
  {
    label: "로그",
    path: "/logs",
    icon: SideLogs,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "대시보드",
    path: "/dashboard",
    icon: SideHome,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "학교 관리",
    path: "/school",
    icon: SideSchool,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "학생 관리",
    path: "/student",
    icon: SideStudent,
    allowRoles: ["master"],
    children: [
      // {
      //   label: "학생 리스트",
      //   path: "/student/list",
      //   icon: SideStudent,
      //   allowRoles: ["master"],
      // },
      // {
      //   label: "신규학생 등록",
      //   path: "/student/add",
      //   icon: SideStudentAdd,
      //   allowRoles: ["master"],
      // },
    ],
  },
  {
    label: "일정 관리",
    path: "/schedule",
    icon: SideSchedule,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "고객센터",
    path: "/cs",
    icon: SideCs,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "콘텐츠 관리",
    path: "/master-video",
    icon: SideContents,
    allowRoles: ["master"],
    children: [],
  },

  // 🔸 노말 전용 메뉴
  {
    label: "대시보드",
    path: "/dashboard",
    icon: SideHome,
    allowRoles: ["teacher"],
    children: [],
  },
  {
    label: "학생관리",
    path: "/student",
    icon: SideStudent,
    allowRoles: ["teacher"],
    children: [
      // {
      //   label: "학생 리스트",
      //   path: "/student/list",
      //   icon: SideStudent,
      //   allowRoles: ["teacher"],
      // },
      // {
      //   label: "학생 등록",
      //   path: "/student/add",
      //   icon: SideStudentAdd,
      //   allowRoles: ["teacher"],
      // },
    ],
  },
  {
    label: "일정 관리",
    path: "/schedule",
    icon: SideSchedule,
    allowRoles: ["teacher"],
    children: [],
  },
  {
    label: "콘텐츠 관리",
    path: "/contents",
    icon: SideContents,
    allowRoles: ["teacher"],
    children: [],
  },
  {
    label: "고객센터",
    path: "/cs",
    icon: SideCs,
    allowRoles: ["teacher"],
    children: [],
  },
  {
    label: "마이페이지",
    path: "/my-page",
    icon: SideMypage,
    allowRoles: ["teacher"],
    children: [],
  },
];

// ✅ 4. 유저 타입별 메뉴 필터링 함수
export function getMenusByRole(role: UserRole): MenuItem[] {
  return MENUS.filter((menu) => menu.allowRoles.includes(role));
}

export function getCurrentMenuItem(
  pathname: string,
  role: UserRole,
): MenuItem | null {
  const menus = getMenusByRole(role);

  for (const menu of menus) {
    if (pathname === menu.path || pathname.startsWith(menu.path + "/")) {
      if (menu.children && menu.children.length > 0) {
        for (const child of menu.children) {
          if (
            pathname === child.path ||
            pathname.startsWith(child.path + "/")
          ) {
            return child;
          }
        }
      }
      return menu;
    }
  }

  return null;
}

export function getCurrentMenuLabel(
  pathname: string,
  role: UserRole,
): string | null {
  const menus = getMenusByRole(role);

  for (const menu of menus) {
    // 1. 상위 메뉴와 완전 일치하면 상위 label 반환
    if (pathname === menu.path || pathname.startsWith(menu.path + "/")) {
      // 2. 하위 메뉴 중 일치하는 것이 있다면 하위 label 반환
      if (menu.children && menu.children.length > 0) {
        for (const child of menu.children) {
          if (
            pathname === child.path ||
            pathname.startsWith(child.path + "/")
          ) {
            return child.label;
          }
        }
      }
      return menu.label;
    }
  }

  return null;
}
