import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsArrowRightCircle } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import { fetchApi } from '../Redux/population/populationSlice';
import Country from './Country';
import styles from './country.module.css';

const CountryList = () => {
  const countryList = useSelector((state) => state.populationSlice.countryList);

  const dispatch = useDispatch();

  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(0);

  const isMobile = window.innerWidth <= 768;
  const itemsPerPage = isMobile ? 6 : 6;

  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(0);
  };

  useEffect(() => {
    if (!countryList) {
      dispatch(fetchApi());
    }
  }, [dispatch, countryList]);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  const filteredItems = countryList
    ? countryList.filter((filtered) => {
      if (search === '') {
        return filtered;
      }
      return filtered.name.toLowerCase().includes(search);
    })
    : [];

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <>
      <div className={styles.banner}>
        <input
          className="py-3 px-4 text-gray-600 placeholder-gray-600 w-full shadow rounded outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-800 dark:focus:bg-gray-700 transition-all duration-200"
          type="text"
          value={search}
          aria-label="search"
          onChange={handleChange}
          placeholder="Search a country..."
        />
      </div>

      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">

        <ul className={styles.countrylist}>
          {displayedItems.length > 0 ? (
            displayedItems.map((country) => (
              <li key={country.numericCode} className={styles.list}>
                <Link to={`/${country.numericCode}`} className={styles.singleCountry}>
                  <BsArrowRightCircle className={styles.direct} />
                  <Country country={country} detailed />
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center h-screen text-4xl dark:text-white">Loading....</p>
          )}
        </ul>
        {/* Pagination component */}
        {countryList && (
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel=""
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
          className={styles.pagination}
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          previousClassName={styles.pageItem}
          previousLinkClassName={styles.pageLink}
          nextClassName={styles.pageItem}
          nextLinkClassName={styles.pageLink}
          activeClassName={styles.active}
        />
        )}
      </div>
    </>
  );
};

export default CountryList;
