/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./purchases_report.css";
import update from "../../image/Update.png";
import invoiceimg from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import Excel from "../../image/excel.webp";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlinePreview } from "react-icons/md";

import * as FileSaver from "file-saver";
// import { useReactToPrint } from 'react-to-print';
import { MdDelete } from "react-icons/md";
import Delete from "../../image/delete.png";
import { ComponentToPrint } from "../../components/GenaratePdf";
import XLSX from "sheetjs-style";
import axios from "axios";
const PurchasesReport = () => {
  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fixData, setFixData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [TotalAmount, setTotalAmount] = useState(0);

  const [searcProductName, setSearchProductName] = useState("");
  const [searcProductCode, setSearchProductCode] = useState("");
  const [Searchcategory, setSearchcategory] = useState("");
  // const [category, setcategory] = useState([]);
  const [product_code, setProductCode] = useState("");
  const [product_trace_id, setProductTraceId] = useState("");
  const [product_name, setProductName] = useState("");
  const [product_type, setProductType] = useState("");
  const [purchase_price, setPurchasePrice] = useState("");
  const [purchase_date, setPurchasedate] = useState("");
  const [shop_name, setShopName] = useState("");
  const [sale_price, setSalePrice] = useState([]);
  const [qunatity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [unitId, setUnitId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [paid, setPaid] = useState("");
  const [contributor_name, setContributorName] = useState("");
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState("");
  const [productdata, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [discount, setDiscount] = useState("");
  const [payment_id, setPaymentId] = useState("");
  // const [prevTotal, SetPrevTotal] = useState("")
  // const [netotal, setNetTotal] = useState("")
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToExcel = async (excelData, fileName) => {
    console.log(excelData);
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const componentRef = useRef();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  const handlePrint = () => {
    toast.dismiss();

    // Show a new toast
    toast("This feature will be added in next update!", {
      autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/transactionsRouter/getAllTransactions"
      );

      if (response.data) {
        const filteredTransactions =
          response.data &&
          response.data.filter(
            (transaction) =>
              transaction.OperationType &&
              transaction.OperationType.operation_name === "Purchase"
          );

        setData(filteredTransactions);
        setRows(filteredTransactions);
        setFixData([...new Set(filteredTransactions)]);
        handleReset();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    document.title = "Product Purchase Report";
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axiosInstance.get("/producttraces/getAll");
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchDataUnit = async () => {
      try {
        const response = await axiosInstance.get("/unit/getAll");
        setUnitData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchAllCategory = async () => {
      try {
        const { data } = await axiosInstance.get("/category/getAll");
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductData();
    fetchDataUnit();
    fetchAllCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (searcProductName === "") {
      toast.dismiss();
      toast.warning("Plaese Fillup serach Input");
      return;
    }
    const results =
      data &&
      data.filter((item) =>
        item.ProductTrace?.name
          .toLowerCase()
          .includes(searcProductName.toLowerCase())
      );

    if (results.length === 0) {
      setRows([]);
      toast.dismiss();
      toast.warning("Not Matching any data");
    } else {
      setRows(results);
    }
  };

  const handleSearchproductcode = (e) => {
    if (searcProductCode === "") {
      toast.dismiss();
      toast.warning("Plaese Fillup serach Input");
      return;
    }
    const results =
      data &&
      data.filter(
        (item) => item.ProductTrace?.product_code === searcProductCode
      );

    if (results.length === 0) {
      setRows([]);
      toast.dismiss();
      toast.warning("Not Matching any data");
    } else {
      setRows(results);
    }
  };
  const handleSearchcategory = (e) => {
    if (Searchcategory === "") {
      toast.dismiss();
      toast.warning("Plaese Fillup serach Input");
      return;
    }
    const results = data.filter((item) =>
      item.ProductTrace?.Category.category_name
        .toLowerCase()
        .includes(Searchcategory.toLowerCase())
    );
    if (results.length === 0) {
      setRows([]);
      toast.dismiss();
      toast.warning("Not matching any data");
    } else {
      setRows(results);
    }
  };

  const [transaction_id, setTranscation] = useState("");

  const handlerow = (item, index) => {
    setTranscation(item.transaction_id);
    setActiveRowIndex(index);
    setQuantity(item.quantity_no);
    setPurchasedate(item.date);
    setSalePrice(item.sale_price);
    setPurchasePrice(item.purchase_price);
    setProductCode(item.ProductTrace?.product_code);
    setProductName(item.ProductTrace?.name);
    setProductType(item.ProductTrace?.type);
    setShopName(item.ShopName?.shop_name);
    setProductTraceId(item.ProductTrace?.product_trace_id);
    setCategory(item.ProductTrace?.Category?.category_name);
    setUnit(item.Unit?.unit);
    setDiscount(item.discount);
    setBrandId(item.Brand?.brand_id);
    setContributorName(item.ContributorName?.contributor_name_id);
    setPaymentId(item.PaymentType?.payment_type_id);

    // setNetTotal(item.amount)
    // if (item.discount > 0) {
    //   const total = Math.floor(calculateTotalWithDiscount(item.purchase_price,item.quantity_no,item.discount))
    //   setTotal(total)
    //   SetPrevTotal(total)
    // }
    // else{
    //   setTotal(parseFloat(item.purchase_price) * parseFloat(item.quantity_no))
    // }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearchDateStartend = () => {
    if (startDate === "" && endDate === "") {
      toast.dismiss();
      toast.warning("Please fill up the date input.");
      return;
    }
    if (startDate === "") {
      toast.dismiss();
      toast.warning("Please fill up start date input.");
      return;
    }
    if (endDate === "") {
      toast.dismiss();
      toast.warning("Please fill up end date input");
      return;
    }

    const filterData = data.filter((item) => {
      const itemDate = item.date.split("T")[0];
      return (
        itemDate >= startDate.split("T")[0] && itemDate <= endDate.split("T")[0]
      );
    });
    if (filterData.length === 0) {
      toast.warning("Not matching any data");
      setRows([]);
      return;
    }

    setRows(filterData);
  };

  const handledateSearch = () => {
    if (date === "") {
      toast.dismiss();
      toast.warning("Please fill up the search input");
      return;
    }
    const filtered = data.filter((item) => {
      const itemDate = item.date.split("T")[0];
      const rangeStartDate = date;

      if (rangeStartDate) {
        return itemDate === rangeStartDate;
      } else {
        return false;
      }
    });
    toast.dismiss();
    if (filtered.length === 0) {
      toast.warning("Not matching any data");
      setRows([]);
      return;
    }

    setRows(filtered);
  };

  const handleReset = () => {
    setSearchProductCode("");
    setSearchProductName("");
    setStartDate("");
    setEndDate("");
    setDate("");
    setSearchcategory("");
    setQuantity("");
    setDiscount("");
    setPurchasedate("");
    setSalePrice("");
    setPurchasePrice("");
    setProductCode("");
    setProductName("");
    setProductType("");
    setShopName("");
    setTotal("");
    setCategory("");
    setUnit("");
    setActiveRowIndex(null);
  };

  useEffect(() => {
    if (rows && rows.length > 0) {
      const total = rows.reduce((accumulator, item) => {
        const itemTotal =
          parseFloat(item.quantity_no) *
          parseFloat(item.purchase_price) *
          (1 - parseFloat(item.discount) / 100);
        return accumulator + itemTotal;
      }, 0);
      setTotalAmount(parseFloat(total, 10));
      console.log(total);
    } else {
      setTotalAmount(0);
    }
  }, [rows]);

  const calculateTotalWithDiscount = (price, quantity, discountPercentage) => {
    // Convert price and quantity to integers
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);

    // Calculate the total without discount
    const totalWithoutDiscount = parsedPrice * parsedQuantity;

    // Calculate the discount amount
    const discountAmount = (totalWithoutDiscount * discountPercentage) / 100;

    // Calculate the total after applying the discount
    const totalWithDiscount = totalWithoutDiscount - discountAmount;

    return totalWithDiscount.toFixed(1) || "";
  };
  // const totalDifference = total - prevTotal;
  // console.log(totalDifference);
  // // Update the transaction amount based on the difference
  // let newTransactionAmount;
  // if (totalDifference > 0) {
  //     // If the item total increases, add the difference to the transaction amount
  //     newTransactionAmount = parseFloat(netotal) + totalDifference;

  // } else if (totalDifference < 0) {
  //     // If the item total decreases, subtract the absolute difference from the transaction amount
  //     newTransactionAmount = parseFloat(netotal) - Math.abs(totalDifference);
  // } else {
  //     // If there's no change in the item total, keep the transaction amount unchanged
  //     newTransactionAmount = parseFloat(netotal);
  // }

  //http://194.233.87.22:5004/api/transactionsRouter/updateTransactionQuantityPurchasePriceSalePriceByID?transaction_id=233&quantity_no=4&purchase_price=80&sale_price=96
  const handleUpdate = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (!transaction_id) {
      toast.warning("Please Select a Row");
      return;
    }
    const newTransactions = {
      transaction_id: transaction_id,
      product_trace_id: product_trace_id,
      quantity_no: qunatity,
      brand_id: brandId || null,
      unit_id: unitId,
      authorized_by_id: 1,
      contributor_name_id: contributor_name || null,
      operation_type_id: 2,
      payment_type_id: payment_id || null,
      paid: paid || 0,
      purchase_price: purchase_price,
      sale_price: sale_price,
      discount: discount,
      shop_name_id: 1,
    };

    try {
      const response = await axiosInstance.put(
        "/transactionsRouter/updateTransactionAllFromAnyPageByID",
        newTransactions,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Successfully Purchase Updateded.");
        setTranscation("");
        fetchData();
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (discount > 0) {
      setTotal(
        Math.floor(
          calculateTotalWithDiscount(purchase_price, qunatity, discount)
        ).toFixed(2)
      );
    } else {
      setTotal(
        (parseFloat(purchase_price) * parseFloat(qunatity) || 0).toFixed(1) ||
          ""
      );
    }
  }, [discount, purchase_price, qunatity]);

  const newDataArray =
    rows.length > 0 &&
    rows.map((row) => ({
      category_name: row.ProductTrace?.Category?.category_name || "",
      product_code: row.ProductTrace?.product_code || "",
      name: row.ProductTrace?.name || "",
      type: row.ProductTrace?.type || "",
      brand_name: row.Brand?.brand_name || "",
      quantity_no: row.quantity_no || "",
      unit: row.Unit?.unit || "",
      purchase_price: row.purchase_price || "",
      discount: row.discount || "",
      total:
        row.discount > 0
          ? Math.floor(
              calculateTotalWithDiscount(
                row.purchase_price,
                row.quantity_no,
                row.discount
              )
            )
          : parseFloat(row.purchase_price) * parseFloat(row.quantity_no),
      sale_price: row.sale_price || "",
      date: row.date ? row.date.split("T")[0] : "",
      shop_name: row.ShopName?.shop_name || "",
    }));

  const deleteTransection = async (event) => {
    if (event.detail > 1) {
      return;
    }
    try {
      if (!transaction_id) {
        //toast message:
        toast.error("Please Selected A Row !");
      } else {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this row?"
        );
        if (confirmDelete) {
          const response = await axiosInstance.delete(
            `/transactionsRouter/deleteTransactionByID?transaction_id=${transaction_id}`
          );

          if (response.status === 200) {
            setTranscation("");
            fetchData();
            handleReset();
            toast.success("Successfully deleted row");
          } else {
            console.log(`Error while deleting row`);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    const fiterBrand = unitData.find((item) => item.unit === unit);
    setUnitId(fiterBrand?.unit_id);
  }, [unit, unitData]);
  return (
    <>
      <div className="full_div_purchases_report">
        <ToastContainer
          theme="light"
          autoClose={1000}
          closeOnClick
          position="top-center"
        />
        <div className="first_row_div_purchase_report">
          <div className="invisible_div_purchase_report">
            <div className="input_field_purchase_report">
              <div className="purchases_report_input">
                <div className="date_input_field_short_long_purchase_report">
                  <label className="label_field_supershop_purchase">
                    Date*
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <button onClick={handledateSearch}>Search</button>
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Category*
                  </label>
                  <input
                    value={Searchcategory}
                    onChange={(e) => setSearchcategory(e.target.value)}
                    list="category_list"
                  />
                  <datalist id="category_list" style={{ height: "5vw" }}>
                    {categories.length > 0 &&
                      categories.map((categroy, index) => {
                        return (
                          <option key={index}>{categroy?.category_name}</option>
                        );
                      })}
                  </datalist>
                  <button onClick={handleSearchcategory}>Search</button>
                </div>
              </div>
              <div className="purchases_report_input_date">
                <div>
                  <div className="date_input_field_short_long_purchase_report">
                    <label className="label_field_supershop_purchase">
                      From Date*
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div className="date_input_field_short_long_purchase_report">
                    <label className="label_field_supershop_purchase">
                      To Date*
                    </label>
                    <input
                      type="date"
                      onChange={handleEndDateChange}
                      value={endDate}
                    />
                  </div>
                </div>
                <div className="purchase_report_search_button">
                  <button onClick={handleSearchDateStartend}>Search</button>
                </div>
              </div>
              <div className="purchases_report_input">
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Name*
                  </label>
                  <input
                    onChange={(e) => setSearchProductName(e.target.value)}
                    list="product_list"
                    value={searcProductName}
                  />
                  <datalist id="product_list">
                    {productdata.length > 0 &&
                      productdata.map((product, index) => {
                        return <option key={index}>{product.name}</option>;
                      })}
                  </datalist>
                  <button onClick={handleSearch}>Search</button>
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Code*
                  </label>
                  <input
                    onChange={(e) => setSearchProductCode(e.target.value)}
                    list="product_code_list"
                    value={searcProductCode}
                  />
                  <datalist id="product_code_list">
                    {productdata.length > 0 &&
                      productdata.map((product, index) => {
                        return (
                          <option key={index}>{product.product_code}</option>
                        );
                      })}
                  </datalist>
                  <button onClick={handleSearchproductcode}> Search</button>
                </div>
              </div>
              <div className="show_all_purchase_button">
                <button onClick={fetchData}>
                  <MdOutlinePreview style={{ fontSize: "2vw" }} />
                </button>
                <div className="button_title">Show All</div>
              </div>
            </div>
          </div>
        </div>
        <div className="second_row_div_purchase_report">
          <div className="table_supershop_purchase_report">
            <div
              className={`${
                loading ? "loader_spriner" : ""
              } table_div_supershop_purchase`}
            >
              {loading ? (
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="64"
                  visible={true}
                />
              ) : (
                <table className="" border={3} cellSpacing={2} cellPadding={5}>
                  <thead>
                    <tr>
                      <th style={Color}>Serial</th>
                      <th style={Color}>Category</th>
                      <th style={Color}>Product Code</th>
                      <th style={Color}>Product Name</th>
                      <th style={Color}>Product Type</th>
                      <th style={Color}>Brand</th>
                      <th style={Color}>Quantity</th>
                      <th style={Color}>Unit</th>
                      <th style={Color}>Purchase Price</th>
                      <th style={Color}>Discount</th>
                      <th style={Color}>Item Total</th>
                      <th style={Color}>Sale Price</th>
                      <th style={Color}>Date</th>
                      <th style={Color}>Shop</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows &&
                      rows.map((row, index) => (
                        <tr
                          key={index}
                          className={
                            activeRowIndex === index ? "active-row" : ""
                          }
                          onClick={() => handlerow(row, index)}
                        >
                          <td>{index + 1}</td>

                          <td>{row.ProductTrace?.Category?.category_name}</td>
                          <td>{row.ProductTrace?.product_code}</td>
                          <td>{row.ProductTrace?.name}</td>
                          <td>{row.ProductTrace?.type}</td>
                          <td>{row.Brand?.brand_name}</td>
                          <td>{row.quantity_no}</td>
                          <td>{row.Unit?.unit}</td>
                          <td>{row.purchase_price}</td>
                          <td>{row.discount}%</td>
                          <td>
                            {row.discount > 0
                              ? calculateTotalWithDiscount(
                                  row.purchase_price,
                                  row.quantity_no,
                                  row.discount
                                )
                              : (
                                  parseFloat(row.purchase_price) *
                                  parseFloat(row.quantity_no)
                                ).toFixed(1)}
                          </td>
                          <td>{row.sale_price}</td>
                          <td>{row.date.split("T")[0]}</td>
                          <td>{row.ShopName?.shop_name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="input_field_short_total">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1vw",
                  width: "4vw",
                }}
                className="label_field_supershop_purchase"
              >
                Total
              </label>
              <input
                value={TotalAmount.toFixed(2)}
                style={{ fontSize: "1.3vw" }}
                className="input_field_supershop_purchase"
              />
            </div>
          </div>
        </div>
        <div className="third_row_div_purchase">
          <div className="first_column_second_row_purchase_report">
            <div className="first_column_second_row_input_field_purchase_report">
              <div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Category
                  </label>
                  <input type="text" value={category} />
                </div>

                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Code
                  </label>
                  <input type="text" value={product_code} />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={product_name}
                    style={{ boxShadow: "none" }}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Type
                  </label>
                  <input type="text" value={product_type} />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={qunatity}
                    className="input_field_supershop_purchase_long quantity_add_purchaes_report"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <select
                    type="text"
                    value={unit}
                    className="unit_add_purchaes_report"
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option disabled selected></option>
                    {unitData.length > 0 &&
                      unitData.map((unit, index) => (
                        <option key={index}>{unit.unit}</option>
                      ))}
                  </select>
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Purchase Price
                  </label>
                  <input
                    type="text"
                    value={purchase_price}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Discount
                  </label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    disabled
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Item Total
                  </label>
                  <input type="text" value={total} />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Sale Price
                  </label>
                  <input
                    type="text"
                    value={sale_price}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Purchase Date
                  </label>
                  <input type="text" value={purchase_date.split("T")[0]} />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">Shop</label>
                  <input type="text" value={shop_name} />
                </div>
              </div>
            </div>
            <div className="all_update_button_purchses_report">
              <div className="update_button_purchses_report">
                <button onClick={handleUpdate}>
                  <img src={update} alt="" />
                </button>
                Update
              </div>
              {/* <div className="Second_update_button_purchses_report">
                <div style={{ display: "none" }}>
                  <ComponentToPrint ref={componentRef} />
                </div>
                <button onClick={handlePrint}>
                  <img src={invoiceimg} alt="" />
                </button>
                View Invoice
              </div> */}
            </div>
          </div>

          <div className="second_column_second_row_purchase_report">
            <div className="reset_button_purchses_report">
              <button onClick={handleReset}>
                <img src={reset} alt="" />
              </button>
              Reset
            </div>
            <div className="reset_button_purchses_report">
              <button onClick={deleteTransection}>
                <img src={Delete} width={25} alt="" />
              </button>
              Delete
            </div>
            <div className="reset_button_purchses_report">
              <button
                onClick={() =>
                  exportToExcel(newDataArray, "Product Purchase Report")
                }
                disabled={data.length > 0 ? false : true}
              >
                <img src={Excel} alt="" />
              </button>
              Excel
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchasesReport;
