import _ from "lodash";

// loginStatusChecker.js
export const checkLoginStatus = () => {
  // todo dev comment
  const isLoggedIn = sessionStorage.getItem("token") === "0";
  return isLoggedIn;
};

// 空文字判定
export const isEmpty = (value) => {
  if (value === null || value === "" || value === undefined) {
    return true;
  } else {
    return false;
  }
};

export const formatNumberWithCommas = (number) => {
  if (isEmpty(number)) {
    return "";
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const findNameById = (id, array) => {
  const foundItem = array.find(item => item.id === id);
  return foundItem ? foundItem.name : null;
};
