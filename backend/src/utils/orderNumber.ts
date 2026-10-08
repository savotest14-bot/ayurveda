export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `VA-${year}${month}${day}-${randomPart}`;
};
