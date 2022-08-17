export interface ICountryObject {
  name: string;
  dialCode: string;
  isoCode: string;
  flag: string;
}

export interface ICountryParams {
  countryFlag: string;
  phonePartial: string;
  phoneISOCode: string;
  phoneDialCode: string;
}
