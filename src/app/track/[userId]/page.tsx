import { getUserById } from "@/app/_actions/actions";
import TrackPage from "@/app/components/Track";
import { redirect } from "next/navigation";

export default async function PreviewEvent({ params: { userId }, }: { params: { userId: string } }) {
    let userData
    if(userId){
      userData = await getUserById(userId);
    }
       
    return (
        <div className="flex flex-1 flex-col w-full h-full">
           <TrackPage userInfo={userData?.data}/>
        </div>
    )
}