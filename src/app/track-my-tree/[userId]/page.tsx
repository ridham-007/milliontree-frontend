import { getUserById } from "@/app/_actions/actions";
import TrackPage from "@/app/components/Track";

export default async function PreviewEvent({
  params: { userId },
}: {
  params: { userId: string };
}) {
  let userData;
  if (userId) {
    userData = await getUserById(userId);
  }

  return (
    <div className="flex flex-1 flex-col w-full h-full z-20 mt-[170px]">
      <TrackPage userInfo={userData?.data} userId={userId} />
    </div>
  );
}
