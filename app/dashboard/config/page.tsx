"use client";

import Checkbox from "@/components/Checkbox";
import Permissions, {
  PermissionLabel,
  PermissionTitleLabel,
} from "@/utils/permission";
import { useRouter } from "next/router";

export default function Page() {
  // return (
  //   <main>
  //     <h2>Campos permitidos</h2>
  //     {Object.keys(Permissions).map((permission, index) => (
  //       <div key={index} className="mt-4">
  //         <h3 className="text-sm">{PermissionTitleLabel[permission]}</h3>
  //         <div className="flex flex-row gap-6 mt-1">
  //           {Permissions[permission].map((key) => (
  //             <Checkbox key={key} name={key} value={key}>
  //               {PermissionLabel[key]}
  //             </Checkbox>
  //           ))}
  //         </div>
  //       </div>
  //     ))}
  //   </main>
  // );
}
