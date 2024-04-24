import { useContext, useEffect } from "react"
import { homeStore } from "./store/HomeStore"
import { ActionsTypes } from "@/types/general"
import { postStore } from "../Posts/store/PostStore";
import ModalHomePost from "./components/ModalHomePost";
import { cn } from "@/lib/utils";
import { HomeSectionType } from "@/services/posts";
import { AuthContext } from "@/context/AuthContext";

function HomePosts() {
  const { homePosts, getHomePosts, setIdHomePostSelected, setAction, open, setOpen, loading, setTypePostSelected } = homeStore()
  const { getPosts } = postStore();
  const {user} = useContext(AuthContext)
  
  useEffect(() => {
    getHomePosts()
    getPosts({user: user!})
    return () => { setIdHomePostSelected(null) }
  }, [])

  const handleSelectPost = (id: string, action: ActionsTypes, type: HomeSectionType = 'section-1') => {
    console.log({ id, action })
    setIdHomePostSelected(id)
    setTypePostSelected(type)
    setAction(action)
    setOpen(true)
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <section className="">
        <h1 className="text-2xl font-semibold">Home Posts</h1>
      </section>

      {homePosts && (
        <section className={
          cn('',
            loading && 'cursor-not-allowed animate-pulse pointer-events-none')
        }>
          <div className="my-3 text-lg font-semibold">
            Editorial y Noticias
          </div>
          <div className="grid grid-cols-3 grid-rows-2 gap-4 py-6">
            <div
              onClick={() => handleSelectPost(homePosts['editorial'][0].id, 'edit', 'editorial')}
              className="col-span-1 row-span-1 cursor-pointer"
            >
              <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
              >
                {homePosts['editorial'][0].post.imageUrl && (
                  <img src={homePosts['editorial'][0].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                )}
                <div>
                  <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['editorial'][0].post.title}</h1>
                  <p className={'text-xs text-black my-5'}>{homePosts['editorial'][0].post.description?.slice(0, 20)}...</p>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleSelectPost(homePosts['section-1'][0].id, 'edit')}
              className="col-span-1 row-span-2 cursor-pointer"
            >
              <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
              >
                {homePosts['section-1'][0].post.imageUrl && (
                  <img src={homePosts['section-1'][0].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                )}
                <div>
                  <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-1'][0].post.title}</h1>
                  <p className={'text-xs text-black my-5'}>{homePosts['section-1'][0].post.description?.slice(0, 20)}...</p>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleSelectPost(homePosts['section-1'][1].id, 'edit')}
              className="col-span-1 row-span-1 cursor-pointer"
            >
              <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
              >
                {homePosts['section-1'][1].post.imageUrl && (
                  <img src={homePosts['section-1'][1].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                )}
                <div>
                  <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-1'][1].post.title}</h1>
                  <p className={'text-xs text-black my-5'}>{homePosts['section-1'][1].post.description?.slice(0, 20)}...</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => handleSelectPost(homePosts['section-1'][2].id, 'edit')}
              className="col-span-1 row-span-1 cursor-pointer"
            >
              <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
              >
                {homePosts['section-1'][2].post.imageUrl && (
                  <img src={homePosts['section-1'][2].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                )}
                <div>
                  <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-1'][2].post.title}</h1>
                  <p className={'text-xs text-black my-5'}>{homePosts['section-1'][2].post.description?.slice(0, 20)}...</p>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleSelectPost(homePosts['section-1'][3].id, 'edit')}
              className="col-span-1 row-span-1 cursor-pointer"
            >
              <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
              >
                {homePosts['section-1'][3].post.imageUrl && (
                  <img src={homePosts['section-1'][3].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                )}
                <div>
                  <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-1'][3].post.title}</h1>
                  <p className={'text-xs text-black my-5'}>{homePosts['section-1'][3].post.description?.slice(0, 20)}...</p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-3 text-lg font-semibold">
            Noticias
          </div>
          <div className="grid grid-cols-4 grid-rows-2 gap-4 py-6">
            <div className="col-span-2 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-2'][0].id, 'edit', 'section-2')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-2'][0].post.imageUrl && (
                    <img src={homePosts['section-2'][0].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-2'][0].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-2'][0].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-2'][1].id, 'edit', 'section-2')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-2'][1].post.imageUrl && (
                    <img src={homePosts['section-2'][1].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-2'][1].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-2'][1].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-2'][2].id, 'edit', 'section-2')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-2'][2].post.imageUrl && (
                    <img src={homePosts['section-2'][2].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-2'][2].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-2'][2].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-2'][3].id, 'edit', 'section-2')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-2'][3].post.imageUrl && (
                    <img src={homePosts['section-2'][3].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-2'][3].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-2'][3].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-2'][4].id, 'edit', 'section-2')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-2'][4].post.imageUrl && (
                    <img src={homePosts['section-2'][4].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-2'][4].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-2'][4].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-2'][5].id, 'edit', 'section-2')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-2'][5].post.imageUrl && (
                    <img src={homePosts['section-2'][5].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-2'][5].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-2'][5].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-2'][6].id, 'edit', 'section-2')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-2'][6].post.imageUrl && (
                    <img src={homePosts['section-2'][6].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-2'][6].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-2'][6].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-3 text-lg font-semibold">
            AudioVisual
          </div>
          <div className="grid grid-cols-4 grid-rows-2 gap-4 py-6">
            <div className="col-span-2 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-3'][0].id, 'edit', 'section-3')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-3'][0].post.imageUrl && (
                    <img src={homePosts['section-3'][0].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-3'][0].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-3'][0].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-3'][1].id, 'edit', 'section-3')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-3'][1].post.imageUrl && (
                    <img src={homePosts['section-3'][1].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-3'][1].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-3'][1].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-3'][2].id, 'edit', 'section-3')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-3'][2].post.imageUrl && (
                    <img src={homePosts['section-3'][2].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-3'][2].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-3'][2].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-3'][3].id, 'edit', 'section-3')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-3'][3].post.imageUrl && (
                    <img src={homePosts['section-3'][3].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-3'][3].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-3'][3].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-3'][4].id, 'edit', 'section-3')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-3'][4].post.imageUrl && (
                    <img src={homePosts['section-3'][4].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-3'][4].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-3'][4].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-3'][5].id, 'edit', 'section-3')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-3'][5].post.imageUrl && (
                    <img src={homePosts['section-3'][5].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-3'][5].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-3'][5].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-3 text-lg font-semibold">
            Lecturas
          </div>
          <div className="grid grid-cols-4 grid-rows-2 gap-4 py-6">
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-4'][0].id, 'edit', 'section-4')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-4'][0].post.imageUrl && (
                    <img src={homePosts['section-4'][0].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-4'][0].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-4'][0].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 cursor-pointer">
              <div
                onClick={() => handleSelectPost(homePosts['section-4'][1].id, 'edit', 'section-4')}
                className="col-span-1 row-span-1 cursor-pointer"
              >
                <div className={'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-md shadow-lg p-1 h-fit'}
                >
                  {homePosts['section-4'][1].post.imageUrl && (
                    <img src={homePosts['section-4'][1].post.imageUrl} alt="" className={'w-full h-2/4 aspect-square object-cover'} />
                  )}
                  <div>
                    <h1 className={'text-xl lg:text-2xl font-thin break-words my-3'}>{homePosts['section-4'][1].post.title}</h1>
                    <p className={'text-xs text-black my-5'}>{homePosts['section-4'][1].post.description?.slice(0, 20)}...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      )}

      {open && <ModalHomePost />}
    </main>
  )
}

export default HomePosts