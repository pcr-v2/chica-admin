import FaceIcon from "@mui/icons-material/Face";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PeopleIcon from "@mui/icons-material/People";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SchoolIcon from "@mui/icons-material/School";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

// ✅ 1. 사용자 타입 정의
export type UserRole = "master" | "teacher";

// ✅ 2. 메뉴 타입 정의
export interface MenuItem {
  label: string;
  path: string;
  icon?: any; // 실제 아이콘 컴포넌트 import 후 사용
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
    label: "학교 관리",
    path: "/school/list",
    icon: SchoolIcon,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "학생 관리",
    path: "/student",
    icon: FaceIcon,
    allowRoles: ["master"],
    children: [
      {
        label: "학생 리스트",
        path: "/student/list",
        icon: null,
        allowRoles: ["master"],
      },
      {
        label: "신규학생 등록",
        path: "/student/add",
        icon: null,
        allowRoles: ["master"],
      },
    ],
  },
  {
    label: "CS관리",
    path: "/cs/list",
    icon: SupportAgentIcon,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "영상 관리",
    path: "/master-video",
    icon: OndemandVideoIcon,
    allowRoles: ["master"],
    children: [],
  },

  // 🔸 노말 전용 메뉴
  {
    label: "대시보드",
    path: "/dashboard",
    icon: QueryStatsIcon,
    allowRoles: ["teacher"],
    children: [],
  },
  {
    label: "학생관리",
    path: "/student",
    icon: FaceIcon,
    allowRoles: ["teacher"],
    children: [
      {
        label: "학생 리스트",
        path: "/student/list",
        icon: null,
        allowRoles: ["teacher"],
      },
      {
        label: "학생 등록",
        path: "/student/add",
        icon: null,
        allowRoles: ["teacher"],
      },
    ],
  },
  {
    label: "영상 관리",
    path: "/video",
    icon: OndemandVideoIcon,
    allowRoles: ["teacher"],
    children: [],
  },
  {
    label: "고객센터",
    path: "/cs/list",
    icon: SupportAgentIcon,
    allowRoles: ["teacher"],
    children: [],
  },
];

// ✅ 4. 유저 타입별 메뉴 필터링 함수
export function getMenusByRole(role: UserRole): MenuItem[] {
  return MENUS.filter((menu) => menu.allowRoles.includes(role));
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
