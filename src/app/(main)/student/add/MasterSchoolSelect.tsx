"use client";

import { useEffect, useState } from "react";

import {
  getSchoolList,
  GetSchoolListResponse,
} from "@/app/actions/school/getSchoolListAction";

interface IProps {
  selectSchoolId: (value: string) => void;
}

export default function MasterSchoolSelect(props: IProps) {
  const { selectSchoolId } = props;
  const [school, setSchool] = useState<GetSchoolListResponse>();

  useEffect(() => {
    getSchoolList().then(setSchool);
  }, []);

  return (
    <div>
      {school?.result &&
        school?.result.map((el) => {
          return (
            <div
              key={el.id}
              onClick={() => selectSchoolId(el.school_id as string)}
            >
              {el.school_name}
            </div>
          );
        })}
    </div>
  );
}
