import { useCallback, useState } from "react";
import FilteredListItems from "./Components/ListItems/FilteredListItems";
import InitialListItems from "./Components/ListItems/InitialListItems";
import useDataLoader from "./Hooks/useDataLoader";
import { debounce } from "./utils/utils";

const endPoint =
  "https://cities-97712-default-rtdb.asia-southeast1.firebasedatabase.app/cities.json";

function App() {
  const cities = useDataLoader(endPoint);
  const [keyword, setKeyword] = useState("");
  const [displayCities, setDisplayCities] = useState([]);

  const filterDisplayCities = debounce((newKeyword) => {
    if (newKeyword.length) {
      if (newKeyword.trim()) {
        const newDisplayCities = cities.filter((cityInfo) => {
          const { city, state } = cityInfo;
          const regex = new RegExp(newKeyword, "gi");
          return regex.test(city) || regex.test(state);
        });
        setDisplayCities(newDisplayCities);

        if (newDisplayCities.length === 0) {
          setDisplayCities([
            {
              city: `There is no city or state including "${newKeyword}". 🤔`,
            },
          ]);
        }
        return;
      }

      setDisplayCities([{ city: "You shouldn't insert white space. 😅" }]);
      return;
    }

    setDisplayCities([]);
  }, 1000);

  const handleInput = useCallback(
    (e) => {
      const newKeyword = e.target.value;
      setKeyword(newKeyword);

      filterDisplayCities(newKeyword);
    },
    [filterDisplayCities],
  );

  return (
    cities && (
      <form className="mx-auto my-[30px] w-2/3 min-w-52 max-w-96 sm:my-[50px] sm:max-w-lg">
        <input
          type="text"
          className="relative -left-[10%] top-[5px] z-[2] w-[120%] rounded-[5px] border-4 border-solid border-[#f7f7f7] p-2 text-center text-xl shadow-input outline-0 sm:-left-[15%] sm:top-[10px] sm:w-[130%] sm:border-8 sm:p-5 sm:text-3xl"
          placeholder="City or State"
          onChange={handleInput}
          value={keyword}
        />
        <ul className="suggestions relative">
          {displayCities.length !== 0 ? (
            <FilteredListItems list={displayCities} />
          ) : (
            <InitialListItems />
          )}
        </ul>
      </form>
    )
  );
}

export default App;
