import Numero from "./Numero";

type CartaoLotofacilProps = {
  cartao15?: number[];
}
export default function CartaoLofacil({ cartao15 = [] }: CartaoLotofacilProps) {
  return (
    <div className="grid grid-cols-5 gap-2 items-center justify-between w-full ">
      {cartao15.map((number, index) => <Numero key={index} number={number} />)}
    </div>
  );
}