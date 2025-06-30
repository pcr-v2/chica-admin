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
  {
    label: "회원관리",
    path: "/member",
    icon: PeopleIcon, // ex) <PersonIcon />
    allowRoles: ["master"],
    children: [
      {
        label: "등록",
        path: "/member/add",
        icon: null, // ex) <PersonIcon />
        allowRoles: ["master"],
      },
    ],
  },
  {
    label: "학교관리",
    path: "/school",
    icon: SchoolIcon,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "학생등록",
    path: "/student",
    icon: FaceIcon,
    allowRoles: ["master"],
    children: [],
  },
  {
    label: "CS관리",
    path: "/cs",
    icon: SupportAgentIcon,
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
        label: "등록",
        path: "/student/add",
        icon: null,
        allowRoles: ["teacher"],
      },
      {
        label: "수정",
        path: "/student/update",
        icon: null,
        allowRoles: ["teacher"],
      },
    ],
  },
  {
    label: "영상관리",
    path: "/video",
    icon: OndemandVideoIcon,
    allowRoles: ["teacher"],
    children: [
      {
        label: "등록",
        path: "/video/add",
        icon: null,
        allowRoles: ["teacher"],
      },
      {
        label: "수정",
        path: "/video/update",
        icon: null,
        allowRoles: ["teacher"],
      },
    ],
  },
  {
    label: "고객센터",
    path: "/cs",
    icon: SupportAgentIcon,
    allowRoles: ["teacher"],
    children: [
      {
        label: "문의 작성",
        path: "/cs/add",
        icon: null,
        allowRoles: ["teacher"],
      },
      {
        label: "이전글 확인",
        path: "/cs/read",
        icon: null,
        allowRoles: ["teacher"],
      },
    ],
  },
];

// ✅ 4. 유저 타입별 메뉴 필터링 함수
export function getMenusByRole(role: UserRole): MenuItem[] {
  return MENUS.filter((menu) => menu.allowRoles.includes(role));
}
