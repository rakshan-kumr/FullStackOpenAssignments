import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const Results = () => {
  return null;
};

const App = () => {
  const [searchValue, setSearchValue] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  const countriesUrl = "https://restcountries.com/v3.1/all";

  useEffect(() => {
    axios.get(countriesUrl).then((response) => {
      setCountryData(response.data);
    });
  }, []);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredCountries = countryData.filter((countryName) =>
    countryName.name.common.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    if (filteredCountries.length > 10) {
      setSearchResults("Too many matches, specify another filter");
    } else {
      setSearchResults(() => {
        console.log(filteredCountries);
        return filteredCountries.map((countryObject) => (
          <div key={countryObject.id}>{countryObject.name.common}</div>
        ));
      });
    }
  }, [searchValue]);

  return (
    <div>
      <p>
        Find countries{" "}
        <input value={searchValue} onChange={handleChange}></input>
      </p>
      {searchResults}
    </div>
  );
};

export default App;
