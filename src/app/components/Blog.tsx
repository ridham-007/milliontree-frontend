'use client'
import Image from "next/image"
import Card from "./Card"
import { useEffect, useState } from "react";
import Pagination from "./ui/Pagination";
import { useRouter } from "next/navigation";
import { paginatedBlog } from "../_actions/actions";
import Loader from "./Loader";
 
export default function Blog() {
  const initialValue = {
    page: 1,
    limit: 4,
  };
  
  const [blogsData, setBlogsData] = useState<any>(initialValue);
  const [blog, setBlog] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const router = useRouter()

  const handlePageChange = (page: number) => {
    setBlogsData({ ...blogsData, page: page });
  };
  
  const fetchBlogs = async () => {
    setLoading(true)
    let updatedEventData: any = {
      ...blogsData,
    }
    try {
      const response:any = await paginatedBlog(updatedEventData);
      if (response?.success) {
        setBlog(response?.data);
        setLoading(false)
      } else {
        console.error("Failed to fetch blogs:", response.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleBlogCardClick = (id: string) => {
    setLoader(true);
    router.push(`/blog-preview/${id}`);
    setLoader(false);
  };

  useEffect(() => {
    fetchBlogs();    
  }, [blogsData]);
  
    return(
        <div className="flex flex-col items-center w-full px-2">
        <div className="flex flex-col w-full max-w-[1280px] gap-10 lg:gap-[70px]">
            <div className="w-full relative z-30">
        <Image src={'/images/plantation-3.jpg'} width={350} height={350} alt="" unoptimized className="w-full h-[280px] sm:h-[350px] rounded-[20px] lg:rounded-[40px]"/>
        <p className="w-full top-32 text-[34px] sm:text-[44px] font-bold absolute text-white text-center tracking-[12px]">BLOG</p>
        </div>
       {loading ? (
            <Loader show={true} />
          ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full justify-items-center sm:px-5">
          <Card 
          data={blog?.blogs}
          className={'max-w-[380px] rounded-[10px] lg:rounded-[30px] cursor-pointer'}
          callBack={handleBlogCardClick}
          />
        </div>
        <div className="flex justify-center pb-10 lg:pb-20"> 
          {blog?.totalPages && <Pagination
            totalPages={blog?.totalPages}
            onPageChange={handlePageChange}
            currentPage={blog?.page}
          />}
         </div>
         </>
         )}
        </div>
        </div>
    )
}