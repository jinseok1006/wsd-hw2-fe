import React, { useEffect, useRef, useState } from "react";
import { Box, Pagination } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Movie } from "../../api";
import MoviePosterInf from "../../components/MoviePosterInf";
import { fadeInCommonOption } from "../../animation/pageTransition";
import { motion } from "motion/react";

const GAP = 2;

export default function MovieTable({
  movies,
  setAdditionalMovies,
}: {
  movies: Movie[];
  setAdditionalMovies: (number: number) => void;
}) {
  const { tableViewRef, tableViewSize } = useTableViewSize();
  const { page, onPageChange, initPage } = usePagination();

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm")); // tablet

  const getImgSize = () => {
    // mobile img 103.66 x 152.42
    // tablet img 161.9 x 238.07
    // pc img 172 x 252.94
    if (isSm) {
      // 태블릿 화면
      return { width: 161.9, height: 238.07 };
    } else {
      // 모바일 화면
      return { width: 103.66, height: 152.42 };
    }
  };
  const imgSize = getImgSize(); // { width: 103.66, height: 152.42 } 등의 값을 반환

  const getNumImg = () => {
    // 화면 크기별 이미지 크기 설정
    // 한 행(row)에 배치될 이미지 수와 열(column)에 배치될 이미지 수 계산
    const gapSize = GAP * 2;
    const titleHeight = 28;
    const columns = Math.floor(
      tableViewSize.width / (imgSize.width + gapSize + 10)
    );
    const rows = Math.floor(
      tableViewSize.height / (imgSize.height + titleHeight + gapSize)
    );

    return { columns, rows };
  };

  const numImg = getNumImg();
  const itemsPerPage = numImg.columns * numImg.rows;
  const currentIdx = (page - 1) * itemsPerPage;
  const pageCount = Math.ceil(movies.length / itemsPerPage);
  // const preloading = useImagePreload(page, itemsPerPage, movies);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (pageCount > 5 && page > pageCount - 4) {
      setAdditionalMovies(1);
    }
  }, [page, pageCount]);

  useEffect(() => {
    initPage();
  }, [tableViewSize.height, tableViewSize.width]);

  return (
    <>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={GAP}
        justifyContent="center"
        alignContent="center"
        ref={tableViewRef}
        sx={{ height: tableViewSize.height }}
        component={motion.div}
        {...fadeInCommonOption}
      >
        {movies.slice(currentIdx, currentIdx + itemsPerPage).map((movie) => (
          <Box key={movie.poster_path}>
            <MoviePosterInf
              movie={movie}
              animate={false}
              width={imgSize.width}
              height={imgSize.height}
            />
          </Box>
        ))}
      </Box>
      <Box
        pt={5}
        pb={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Pagination
          count={isNaN(pageCount) ? 1 : pageCount}
          page={page}
          onChange={onPageChange}
          siblingCount={1}
          boundaryCount={0}
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </>
  );
}

// function useImagePreload(page: number, itemsPerPage: number, movies: Movie[]) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!movies || movies.length === 0) {
//       setLoading(false);
//       return;
//     }

//     const startIdx = (page - 1) * itemsPerPage;
//     const currentMovies = movies.slice(startIdx, startIdx + itemsPerPage);

//     // 모든 이미지 로드 확인
//     const imageLoadPromises = currentMovies.map(
//       (movie) =>
//         new Promise<void>((resolve) => {
//           const img = new Image();
//           img.src = `${TMDB_IMAGE}/w300/${movie.poster_path}`; // replace with actual poster URL field
//           img.onload = () => resolve();
//           img.onerror = () => resolve(); // 에러가 발생해도 처리
//         })
//     );

//     setLoading(true);
//     Promise.all(imageLoadPromises).then(() => {
//       setLoading(false);
//     });
//   }, [page, movies, itemsPerPage]);

//   return loading;
// }

function useTableViewSize() {
  const tableViewRef = useRef<HTMLDivElement>(null);
  const [tableViewSize, setTableViewSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      if (tableViewRef.current) {
        const width = tableViewRef.current.clientWidth;
        const height = window.innerHeight - 64 - 68 - 96;

        setTableViewSize({
          width,
          height,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return { tableViewRef, tableViewSize };
}

function usePagination() {
  const [page, setPage] = useState(1);

  const onPageChange = (e: React.ChangeEvent<unknown>, newPage: number) => {
    e.preventDefault();
    setPage(newPage);
  };

  const initPage = () => {
    setPage(1);
  };

  return { page, onPageChange, initPage };
}
