import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { FunctionComponent, useEffect, useState } from "react";
import { AiFillStar, AiTwotoneCalendar } from "react-icons/ai";
// import { BsThreeDotsVertical } from "react-icons/bs";
import {Hypnosis} from "react-cssfx-loading";
import { GiHamburgerMenu } from "react-icons/gi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useCurrentViewportView } from "../../hooks/useCurrentViewportView";
import { API_URL } from "../../shared/constants";
import { db } from "../../shared/firebase";
import {
  DetailMovie,
  DetailTV,
  Episode,
  getWatchReturnedType,
  Item,
} from "../../shared/types";
import { embedMovie, embedTV } from "../../shared/utils";
import { useAppSelector } from "../../store/hooks";
// import ReadMore from "../Common/ReadMore";
import RightbarFilms from "../Common/RightbarFilms";
// import SearchBox from "../Common/SearchBox";
import Sidebar from "../Common/Sidebar";
import SidebarMini from "../Common/SidebarMini";
import Skeleton from "../Common/Skeleton";
import Title from "../Common/Title";
import Footer from "../Footer/Footer";
import Comment from "./Comment/Comment";
// import SeasonSelection from "./SeasonSelection";

interface FilmWatchProps {
  media_type: "movie" | "tv";
  seasonId?: number;
  episodeId?: number;
  currentEpisode?: Episode;
}

const FilmWatch: FunctionComponent<FilmWatchProps & getWatchReturnedType> = ({
  detail,
  recommendations,
  // detailSeasons,
  media_type,
  currentEpisode,
}) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { isMobile } = useCurrentViewportView();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [externalIds, setExternalIds] = useState();
  const [isLoaded, setIsLoaded] = useState(false)
  const [ukrIframe, setUkrIframe] = useState()
  // const [data, setData] = useState()

  useEffect(() => {
    if (!detail) return;

    if(media_type === "tv"){
      fetch(`${API_URL}/tv/${detail.id}/external_ids?api_key=e3bb99f79b1bb8906dac2d3227927c8f`)
        .then(response => {
          if(response.ok){
            return response.json()
          }
          throw response
        })
        .then(data => {
          setExternalIds(data)
          console.log(externalIds)
        })
        .catch(err => {
          console.error(err)
        })
    }
    if(media_type === "movie"){
      fetch(`${API_URL}/movie/${detail.id}/external_ids?api_key=e3bb99f79b1bb8906dac2d3227927c8f`)
        .then(response => {
          if(response.ok){
            return response.json()
          }
          throw response
        })
        .then(data => {
          setExternalIds(data)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }, [detail, media_type])

  useEffect(() => {
    if(!detail?.imdb_id || !externalIds) return
    fetch(`https://dudeplex-cors-proxy.vercel.app/base.ashdi.vip/api/product/read_one.php?imdb=${detail.imdb_id || externalIds["imdb_id"]}&api_key=737406-699fe6-1ed65f-f92e4a-4274f8`)
      .then(response => {
        if(response.ok){
          return response.json()
        }
        throw response
      })
      .then(data => {
        setUkrIframe(data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [detail, externalIds])

  console.log('Ukraine', ukrIframe)

  useEffect(() => {
    if (!currentUser) return;
    if (!detail) return; // prevent this code from storing undefined value to Firestore (which cause error)

    getDoc(doc(db, "users", currentUser.uid)).then((docSnap) => {
      const isAlreadyStored = docSnap
        .data()
        ?.recentlyWatch.some((film: Item) => film.id === detail?.id);

      if (!isAlreadyStored) {
        updateDoc(doc(db, "users", currentUser.uid), {
          recentlyWatch: arrayUnion({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: media_type,
            ...(media_type === "movie" && {
              title: (detail as DetailMovie)?.title,
            }),
            ...(media_type === "tv" && { name: (detail as DetailTV)?.name }),
          }),
        });
      } else {
        const updatedRecentlyWatch = docSnap
          .data()
          ?.recentlyWatch.filter((film: Item) => film.id !== detail?.id)
          .concat({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: media_type,
            ...(media_type === "movie" && {
              title: (detail as DetailMovie)?.title,
            }),
            ...(media_type === "tv" && { name: (detail as DetailTV)?.name }),
          });

        updateDoc(doc(db, "users", currentUser.uid), {
          recentlyWatch: updatedRecentlyWatch,
        });
      }
    });
  }, [ detail, media_type]);

  useEffect(() => {
    compareIds()
    
  },[externalIds, isLoaded])

  const compareIds = async () => {

    if(!externalIds) return

    if(media_type === "movie"){
      await fetch(`https://dudeplex-cors-proxy.vercel.app/videocdn.tv/api/movies?api_token=IISbfTsMm42mRk7dtPxB5zmhEfK3YKau&imdb_id=${externalIds["imdb_id"]}`, {headers: {'Access-Control-Allow-Origin': '*' }})
        .then(response => {
          if(response.ok){
            return response.json()
          }

          throw response
        })
        .then(data => {
          console.log(data)
          if(data["data"].length !== 0){
            setIsLoaded(true)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    if(media_type === "tv"){
      await fetch(`https://dudeplex-cors-proxy.vercel.app/videocdn.tv/api/tv-series?api_token=IISbfTsMm42mRk7dtPxB5zmhEfK3YKau&imdb_id=${externalIds["imdb_id"]}`, {headers: {'Access-Control-Allow-Origin': '*' }})
        .then(response => {
          if(response.ok){
            return response.json()
          }

          throw response
        })
        .then(data => {
          console.log(data["data"])
          if(data["data"].length !== 0){
            setIsLoaded(true)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  return (
    <>
      {detail && (
        <Title
          value={`Дивитись: ${
            (detail as DetailMovie).title || (detail as DetailTV).name
          } | DUDEPLEX`}
        />
      )}

      <div className="flex md:hidden justify-between items-center px-5 my-5">
        <Link to="/" className="flex gap-2 items-center">
          <LazyLoadImage
            src="/logo.ico"
            className="h-10 w-10 rounded-full object-cover"
          />
          <p className="text-xl text-white font-medium tracking-wider uppercase">
            Dude<span className="text-primary">plex</span>
          </p>
        </Link>
        <button onClick={() => setIsSidebarActive((prev) => !prev)}>
          <GiHamburgerMenu size={25} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {!isMobile && <SidebarMini />}
        {isMobile && (
          <Sidebar
            setIsSidebarActive={setIsSidebarActive}
            isSidebarActive={isSidebarActive}
          />
        )}
        <div className="flex-grow px-[2vw] md:pt-11 pt-0">
          <div className="relative h-0 pb-[56.25%]">
            {!detail && (
              <Skeleton className="absolute top-0 left-0 w-full h-full rounded-sm" />
            )}
            {/* {detail && (
              <iframe
                className="absolute w-full h-full top-0 left-0"
                src={
                  media_type === "movie"
                    ? embedMovie(detail.imdb_id)
                    : ( externalIds && embedTV(externalIds["imdb_id"]))
                }
                title="Film Video Player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )} */}
            {(detail && isLoaded && ukrIframe === undefined) ? (
              <iframe
                className="absolute w-full h-full top-0 left-0"
                src={
                  media_type === "movie"
                    ? embedMovie(detail.imdb_id)
                    : ( externalIds && embedTV(externalIds["imdb_id"]))
                }
                title="Film Video Player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ): (
              <div className="absolute grid w-full h-full content-center justify-items-center">
                <Hypnosis color="#a3e635" width={50} height={50} />
              </div>
            )}
            {(detail && isLoaded && ukrIframe !== undefined) && (
              <iframe
                className="absolute w-full h-full top-0 left-0"
                src={ukrIframe["url"]}
                title="Film Video Player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </div>
          <div className="mt-5 pb-8">
            <div className="flex justify-between md:text-base text-sm">
              <div className="flex-1">
                {!detail && <Skeleton className="h-8 w-[400px]" />}
                {detail && (
                  <h1 className="text-white md:text-3xl text-xl font-medium">
                    <Link
                      to={
                        media_type === "movie"
                          ? `/movie/${detail.id}`
                          : `/tv/${detail.id}`
                      }
                      className="hover:brightness-75 transition duration-300"
                    >
                      {(detail as DetailMovie).title ||
                        (detail as DetailTV).name}
                    </Link>
                  </h1>
                )}
                {!detail && <Skeleton className="w-[100px] h-[23px] mt-5" />}
                {detail && (
                  <div className="flex gap-5 mt-5">
                    <div className="flex gap-2 items-center">
                      <AiFillStar size={25} className="text-primary" />
{/*                       {media_type === "movie" && (
                        <p>{detail.vote_average.toFixed(1)}</p>
                      )}
                      {media_type === "tv" && (
                        <p>{currentEpisode?.vote_average.toFixed(1)}</p>
                      )} */}
                      <p>{detail.vote_average.toFixed(1)}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <AiTwotoneCalendar size={25} className="text-primary" />
                      <p>
                        {media_type === "movie" &&
                          new Date(
                            (detail as DetailMovie).release_date
                          ).getFullYear()}
                        {media_type === "tv" &&
                          new Date(
                            (currentEpisode as Episode).air_date
                          ).getFullYear()}
                      </p>
                    </div>
                    {ukrIframe && (<p>🇺🇦</p>)}
                  </div>
                )}
                {!detail && <Skeleton className="w-[100px] h-[23px] mt-2" />}
                {!isMobile && detail && (
                  <ul className="flex gap-2 flex-wrap mt-3">
                    {detail.genres.map((genre) => (
                      <li key={genre.id} className="mb-2">
                        <Link
                          to={`/explore?genre=${genre.id}`}
                          className="px-3 py-1 bg-dark-lighten rounded-full hover:brightness-75 duration-300 transition"
                        >
                          {genre.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* {media_type === "tv" && currentEpisode && (
                <div className="flex-1">
                  <h2 className="md:text-xl italic uppercase text-gray-200 mt-2 text-right">
                    {currentEpisode.name}
                  </h2>
                  <p className="text-right md:text-lg mt-2">
                    Сезон {seasonId} &#8212; Епізод {episodeId}
                  </p>
                </div>
              )} */}
            </div>
            {isMobile && detail && (
              <ul className="flex gap-2 flex-wrap mt-3">
                {detail.genres.map((genre) => (
                  <li key={genre.id} className="mb-2">
                    <Link
                      to={`/explore?genre=${genre.id}`}
                      className="px-3 py-1 bg-dark-lighten rounded-full hover:brightness-75 duration-300 transition"
                    >
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {currentUser?.email !== "kolya.sotnichenko0811@gmail.com" && (
              <div id="container-80f5fa6e0fb7dda9e9f501c7a9829701"></div>
            )}
            {/* <div className="md:text-xl text-lg font-medium text-white mt-5">
            Огляд:
            </div>
            {!detail && <Skeleton className="h-[84px] mt-2" />}
            {detail && (
              <ReadMore
                limitTextLength={300}
                className="md:text-lg text-base mt-1"
              >
                {media_type === "movie"
                  ? detail.overview
                  : currentEpisode?.overview}
              </ReadMore>
            )} */}
          </div>
          <Comment media_type={media_type} id={detail?.id} />
        </div>
        {/* <div className="shrink-0 md:max-w-[400px] w-full relative px-6">
          {!isMobile && <SearchBox />}
          {media_type === "movie" && (
            <RightbarFilms
              name="Recommendations"
              films={recommendations?.filter((item) => item.id !== detail?.id)}
              limitNumber={4}
              isLoading={!recommendations}
              className="md:mt-24 mt-0"
            />
          )}
          {media_type === "tv" && (
            <div className="md:mt-24 mt-0">
              <p className="mb-6 text-xl font-medium flex justify-between items-center">
                <span className="text-white">Seasons:</span>
                <BsThreeDotsVertical size={20} />
              </p>
              <SeasonSelection
                detailSeasons={detailSeasons}
                seasonId={seasonId}
                episodeId={episodeId}
              />
            </div>
          )}
        </div> */}
        <div className="shrink-0 md:max-w-[400px] w-full relative px-6">
            <RightbarFilms
              name="Рекомендації"
              films={recommendations?.filter((item) => item.id !== detail?.id)}
              limitNumber={4}
              isLoading={!recommendations}
              className="md:mt-24 mt-0"
            />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FilmWatch;
