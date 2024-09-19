import SearchTree from "../components/SearchTree";

export default async function SearchTreeLayout({ params: { userId }, }: { params: { userId: string } }) {
   
       
    return (
        <div className="flex flex-1 flex-col w-full h-full">
           <SearchTree/>
        </div>
    )
}