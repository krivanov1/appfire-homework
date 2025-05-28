/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { method, set } from "lodash";
import SubtasksTable from "@/components/subtasks-table";
import { url } from "inspector";

// Add a type definition for window.AP
declare global {
  interface Window {
    AP: Record<any, any>;
  }
}

const SubtasksPage = () => {


  const [context, setContext] = useState<any>(null);
  const [subtasks, setSubtasks] = useState<any[]>([]);


  useEffect(() => {
    if (!window.AP) {
      // console.error("AP object is not available");
      return;
    }
    window.AP.context.getContext((response: { jira: any; }) => {
      setContext(response);
    });
  }, []);


  useEffect(() => {

    if(!context) return;

    window.AP.request(`/rest/api/3/issue/${context.jira.issue.key}`, {
      success: function (response: any) {
        const issue = JSON.parse(response);
        const subtaskKeys = issue?.fields?.subtasks.map((subtask: any) => subtask.key);
        if(subtaskKeys.length > 0) {
          window.AP.request({
            url: "/rest/api/3/issue/bulkfetch",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              issueIdsOrKeys: subtaskKeys,
              fields: [
                "summary",
                "created",
                "assignee",
                "status",
                "priority",
                "id",
                "links"
              ],
            }),
            success: function (response: any) {
              const data = JSON.parse(response);
              setSubtasks(data.issues || []);
            }
          });
        }
      }
    })
  }, [context]);


  return (
    <>
      <Script
        id="alljs-script"
        src="https://connect-cdn.atl-paas.net/all.js"
        strategy="beforeInteractive"
        onError={(e) => console.error("Script failed to load", e)}
        onLoad={() => {
          if (window.AP) {
            window.AP.resize();
          } else {
            console.error("AP object is not available");
          }
        }}
      />
      <SubtasksTable subtasks={subtasks} />
    </>
  );
};

export default SubtasksPage;
