
import dynamic from "next/dynamic";
import { cookies } from "next/headers";


const Admin = dynamic(() => import("@/app/components/Admin"), { ssr: false });

export default async function AdminLayout(props:any) {
  const userCookie = await cookies().get("user")?.value;
  let user = null; 

  if (userCookie) {
    user = JSON.parse(userCookie); 
  }
  return (
    <div className="flex flex-1 flex-col w-full h-full">
      {user?.user?.userRole && user?.user?.userRole === "admin" ? (
        <Admin queryParams={props?.searchParams} authId={user?.user?._id} />
      ) : (
        <div className="flex justify-center items-center w-full h-full ">
          <div className="text-[24px] md:text-[30px] font-bold text-[#FF772E]">
            You are not authorized
          </div>
        </div>
      )}
    </div>
  );
}