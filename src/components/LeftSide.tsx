import Link from 'next/link'

const menuList = [
    {
      id: 1,
      name: "Homepage",
      link: "/",
      icon: 'home.svg',
    },
    {
      id: 2,
      name: "Explore",
      link: "/",
      icon: 'explore.svg',
    },
    {
      id: 3,
      name: "Notifications",
      link: "/",
      icon: 'notification.svg',
    },
    {
      id: 4,
      name: "Messages",
      link: "/",
      icon: 'message.svg',
    },
    {
      id: 5,
      name: "Bookmarks",
      link: "/",
      icon: 'bookmark.svg',
    },
    {
      id: 6,
      name: "Profile",
      link: "/test",
      icon: 'profile.svg',
    },
    {
      id: 7,
      name: "More",
      link: "/",
      icon: 'more.svg',
    },
  ]

  const LeftBar = () => {
    return (
      <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
          {/* LOGO MENU */}
          <div className="flex flex-col gap-4 text-lg xxl:items-start">
  
            {/* MENU LIST */}
            <div className="flex flex-col gap-4">
              {menuList.map((item) => (
                <Link href={item.link} className="p-2 rounded-full hover:bg-[#449758] flex items-center gap-4" key={item.id}>
                  {/* <Image_comp src={`icons/${item.icon}`} alt={item.name} w={24} h={24}/> */}
                  <span className="hidden xxl:inline"> {item.name} </span>
                </Link>
              ))}
            </div>
  
            {/* POST BUTTON */}
            <Link href='/compose/post' className=" bg-white text-black rounded-full font-bold w-12 h-12 flex items-center justify-center xxl:hidden">
              {/* <Image_comp src='icons/post.svg' alt="new-post" w={24} h={24}/> */}
            </Link>
            <Link href='/compose/post' className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20">
              Post
            </Link>
          </div>
  
          
          {/* USER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 relative rounded-full overflow-hidden">
                {/* <Image_comp src='/general/avatar.png' alt="" w={100} h={100} tr={true}/> */}
              </div>
              <div className="hidden xxl:flex flex-col">
                <span className="font-bold">Jailbreak</span>
                <span className="text-sm text-gray-300">@jailbreak_1</span>
              </div>
            </div>
            <div className="hidden xxl:block cursor-pointer font-bold">...</div>
          </div>
      </div>
    )
  }

  export default LeftBar;