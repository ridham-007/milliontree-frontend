import { getBlogById } from "@/app/_actions/actions";
import BlogPreview from "@/app/components/BlogPreview";


export default async function BlogPreviewLayout({ params: { blogId }, }: { params: { blogId: string } }) {
    
    const response = await getBlogById(blogId);
       
    return (
        <div className="flex flex-1 flex-col items-center px-2 w-full h-full pt-40">
           <BlogPreview data={response?.data || []}/>
        </div>
    )
}