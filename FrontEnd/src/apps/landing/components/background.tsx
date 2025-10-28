import landingCityDay from "../../../assets/svg/landing_city_day.svg";



export function Background() {
  console.log("Background mounted");
  return (
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
      style={{
       backgroundImage: `url(${landingCityDay})`,

      }}
    /> 
  );
}
