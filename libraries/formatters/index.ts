import { CPFtoScreenFormat } from "./cpfToScreen";
import { FirstAndLastNameFormat } from "./firstAndLastName";
import { nameFormat } from "./name";
import { OnlyNumberFormat } from "./onlyNumbers";
import { WithoutAccentFormat } from "./withoutAccent";
import { ZipCodeToScreenFormat } from "./zipcodeToScreen";


export const formatter = {
   Name : nameFormat,
   NameFirstAndLast: FirstAndLastNameFormat,
   CpfToScreen: CPFtoScreenFormat,
   OnlyNumbers: OnlyNumberFormat,
   WithoutAccent: WithoutAccentFormat,  
  ZipcodeToSccreen: ZipCodeToScreenFormat,
}