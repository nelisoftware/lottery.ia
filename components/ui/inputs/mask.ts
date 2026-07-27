export function maskControle(e: React.FormEvent<HTMLInputElement>, mask: 'cep' | 'cpf' | 'onlyNumber' | 'phone') {

  if (mask === 'cep') { 
    e.currentTarget.maxLength = 8;
  } else if (mask === 'phone') {
    e.currentTarget.maxLength = 16;
  } else if (mask === 'cpf') {
    e.currentTarget.maxLength = 14;
  }

  let value = e.currentTarget.value;
  value = value.replace(/\D/g,"");

  if (mask === 'phone') {
    if (value.length === 8) {
      value = value.replace(/^(\d{4})(\d{4})/,"$1-$2");
    } else if (value.length === 9) {
      value = value.replace(/^(\d{5})(\d{4})/,"$1-$2");
    } else if (value.length === 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{4})/,"($1) $2-$3")
    } else if (value.length === 11) { 
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/,"($1) $2-$3");
    }else if (value.length > 11) {
      value  = value.replace(/^(\d)/,"+$1");
    }
  } else if (mask === 'cep') {
    if (value.length === 8) value = value.replace(/^(\d{5})(\d)/,"$1-$2");
  } else if (mask === 'cpf') {
    if (value.length === 11) value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d)/,"$1.$2.$3-$4");    
  }

  e.currentTarget.value = value;
  return e;
}