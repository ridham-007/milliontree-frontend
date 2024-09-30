import BlogPreview from "@/app/components/BlogPreview";


export default async function BlogPreviewLayout({ params: { slug }, }: { params: { slug: string } }) {
   
       
    return (
        <div className="flex flex-1 flex-col items-center px-2 w-full h-full pt-40">
           <BlogPreview/>
        </div>
    )
}