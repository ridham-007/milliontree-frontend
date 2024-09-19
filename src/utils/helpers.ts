
export function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target: any, source: any) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export function prepareServerError(error: string){
  return {
    success:false,
    errors:{'server':error??'Internal Server Error'},
  }
}

// export function formatDate(dateString: string): string {
//   const date = new Date(dateString);
//   const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
//   const formattedDate = date.toLocaleDateString('en-US', options);
//   const day = date.getDate();
//   let daySuffix = '';

//   if (day > 3 && day < 21) {
//     daySuffix = 'th';
//   } else {
//     switch (day % 10) {
//       case 1: daySuffix = 'st'; break;
//       case 2: daySuffix = 'nd'; break;
//       case 3: daySuffix = 'rd'; break;
//       default: daySuffix = 'th'; break;
//     }
//   }

//   const parts = formattedDate.split(' ');
//   parts[1] = `${day}${daySuffix},`;

//   return parts.join(' ');
// }
export function formatDate(dateString: string) {
  const [datePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[parseInt(month) - 1];
  return `${monthName} ${parseInt(day)}, ${year}`;
}