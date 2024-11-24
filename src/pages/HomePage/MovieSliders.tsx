import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import classNames from "classnames/bind";
import styles from "./index.module.css";
import { Movie } from "../../api";
import { useEffect } from "react";
import { motion } from "motion/react";
import {
  fadeInAnimation,
  fadeInCommonOptions,
} from "../../animation/pageTransition";
import MoviePoster from "./MoviePoster";

const slideStyle = { paddingTop: "10px", paddingBottom: "10px" };

export default function MovieSlider({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  const cx = classNames.bind(styles);

  useEffect(() => {
    console.log("mount!");
    return () => {
      console.log("unmount?");
    };
  }, []);

  return (
    <div className={cx("content-list")}>
      <h1>{title}</h1>
      <motion.div
        {...fadeInCommonOptions}
      >
        <Swiper
          modules={[Navigation, Mousewheel]}
          slidesPerView={"auto"}
          navigation
          spaceBetween={20}
          slidesPerGroup={5}
          // mousewheel={true}
          zoom={true}
        >
          {movies.map((movie) => (
            <SwiperSlide
              key={movie.id}
              className={cx("item")}
              style={slideStyle}
            >
              <MoviePoster movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
}

// const [movies, setMovies] = useState<Movie[]>([]);

// useEffect(() => {
//   fetch(
//     `https://yts.mx/api/v2/list_movies.json?limit=20&sort_by=rating&page=${page}`
//   )
//     .then((response) => response.json())
//     .then((data) => setMovies(data.data.movies))
//     .catch((error) => console.error("Error fetching movies:", error));
// }, [page]);
