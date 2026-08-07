"use client";

import dynamic from "next/dynamic";

const JobsMap = dynamic(() => import("./JobsMap"), { ssr: false });

export default function ClientOnlyJobsMap({ jobs }) {
  return <JobsMap jobs={jobs} />;
}
