/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./salereport.css";
import ExcelExport from "../../components/ExportExcel";
import { MdPreview } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { RxUpdate } from "react-icons/rx";
import { BiReset } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { SaleReportPos } from "../../components/SaleReportPos";

const SaleReport = () => {
  const [filteredRows, setFilteredRows] = useState([]);
  const [productName, setProductName] = useState([]);
  const [DateFrom, setDateFrom] = useState([]);
  const [DateTo, setDateTo] = useState([]);
  const [type, setType] = useState([]);
  const [invoice, setInvoice] = useState([]);

  // const [salePrice, setSalePrice] = useState("");
  const [total, setTotal] = useState("");
  const [product, setProduct] = useState("");
  const [ptype, setPtype] = useState("");
  // const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [onlyDate, setOnlyDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [code, setCode] = useState("");
  const [shopName, setShopName] = useState("");
  const [distinctProductCode, setDistinctProductCode] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  // const [Amount, setAmount] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [transaction_id, setTranstionId] = useState("");
  const [invoice_no, setInvoiceNo] = useState("");
  const [product_trace_id, setProductTranceId] = useState("");
  const [brand_id, setBardId] = useState("");
  const [quantity_no, setQuantity] = useState("");
  const [unit_id, setUnitId] = useState("");
  const [warranty, setWarranty] = useState("");
  const [tax_id, setTaxId] = useState("");
  const [amount, setAmount] = useState("");
  const [authorized_by_id, setAuthorizedById] = useState("");
  const [contributor_name_id, setContributorNameId] = useState("");
  const [operation_type_id, setOperationTypeId] = useState("");
  const [date, setDate] = useState("");
  const [other_cost, setOtherCost] = useState("");
  const [payment_type_id, setPaymentTypeId] = useState("");
  const [shop_name_id, setShopNameId] = useState("");
  const [paid, setPaid] = useState("");
  const [purchase_price, setPurchasePrice] = useState("");
  const [sale_price, setSalePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [comment, setComment] = useState("");
  const [itemTotals, setItemTotals] = useState("");
  const toastId = React.useRef(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    document.title = "Product Sale Report";
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );
        // console.log(response_getAllTranscatioData)
        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredRows = datas_getAllTranscatioData.filter(
          (item) => item.OperationType?.operation_name === "Sale"
        );

        setRows(filteredRows);
        setFixData([...new Set(filteredRows)]);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setButtonVisible(false);
    setSelectedInvoice("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickShowAll = () => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredRows = datas_getAllTranscatioData.filter(
          (item) => item.OperationType?.operation_name === "Sale"
        );
        setTimeout(() => {
          setRows(filteredRows);
          setFixData([...new Set(filteredRows)]);
          console.log(datas_getAllTranscatioData);
          handleReset();
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setSelectedID(null);
    setButtonVisible(false);
    setSelectedInvoice("");
  };

  // Filter Product
  // http://194.233.87.22:5003/api/producttraces/getAll

  const ProductCode = () => {
    const fetchData = async () => {
      try {
        const response_getAllPrductCode = await axiosInstance.get(
          "/producttraces/getAll"
        );

        const datas_getAllPrductCode = response_getAllPrductCode.data;

        setDistinctProductCode([...new Set(datas_getAllPrductCode)]);
        console.log(datas_getAllPrductCode);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
  };

  useEffect(() => {
    const handleChangeProductCode = () => {
      const result =
        fixData &&
        fixData.find((item) => item.ProductTrace?.product_code === code);
      console.log(result);

      if (result) {
        setProductTranceId(result.product_trace_id);
        setProduct(result.ProductTrace?.name);
        setPtype(result.ProductTrace?.type);
        setPurchasePrice(result.purchase_price);
        setUnit(result.Unit?.unit);
        setUnitId(result.Unit?.unit_id);
        setSalePrice(result.sale_price);
      } else {
        setProductTranceId("");
        setProduct("");
        setPtype("");
        setType("");
        setUnit("");
        setUnitId("");
        setPurchasePrice("");
        setSalePrice("");
        setTotal("");
      }
    };
    handleChangeProductCode();
  }, [code, fixData]);

  const FetchAllInvoice = () => {
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        // const allInvoices = datas_getAllTranscatioData.map((item) => {
        //   return item.invoice_no;
        // });
        const allInvoices = datas_getAllTranscatioData
          .filter((item) => item.OperationType?.operation_name === "Sale")
          .map((item) => item.invoice_no);

        setInvoice([...new Set(allInvoices)]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  };

  useEffect(() => {
    ProductCode();
    FetchAllInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //code search
  const handleFilterDataCode = () => {
    if (!filteredRows || typeof filteredRows !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("BarCode Is Required");
      }
      return;
    }
    const filterData = fixData.filter(
      (item) => item.ProductTrace?.product_code === filteredRows
    );

    if (filterData.length === 0) {
      toast.error("Input data not valid");
      // handleClickShowAll();
    }

    setRows(filterData);
  };

  // type search
  const handleFilterType = () => {
    if (!type || typeof type !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Type Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.type.toLowerCase().includes(type.toLowerCase())
        : ""
    );
    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
  };

  // product search
  const handleFilterProduct = () => {
    if (!productName || typeof productName !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Product Name Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.name
            .toLowerCase()
            .includes(productName.toLowerCase())
        : ""
    );
    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
  };

  // invoice search
  const handleFilterInvoice = () => {
    if (!selectedInvoice || typeof selectedInvoice !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Invoice Serial Is Required");
      }
      return;
    }

    const filterData =
      fixData && fixData.filter((row) => row.invoice_no === selectedInvoice);
    console.log(filterData);

    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
    setButtonVisible(true);
  };

  // data search

  const handelShowSaleData = () => {
    handleClickShowAll();
    setProductName("");
    setDateFrom("");
    setDateTo("");
    setType("");
    setFilteredRows("");
  };

  const handleFilterDate = () => {
    if (
      !DateFrom ||
      !DateTo ||
      typeof DateFrom !== "string" ||
      typeof DateTo !== "string"
    ) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Both Date Fields Are Required");
      }
      return;
    }
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0];
        return (
          itemDate >= DateFrom.split("T")[0] && itemDate <= DateTo.split("T")[0]
        );
      }
      return false;
    });

    setRows(filterData);
  };

  const handleFilterOnlyDate = () => {
    if (!onlyDate) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Date Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return itemDate.includes(onlyDate.toLowerCase());
      }
      return false;
    });

    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Data not Found");
    }

    setRows(filterData);
    setOnlyDate("");
  };

  // Updated Product Sale
  // http://194.233.87.22:5004/api/transactionsRouter/updateTransactionFromAnyPageByID?quantity_no=&sale_price=&transaction_id=&amount=
  const updateSaleReport = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (!selectedID) {
      toast.warning("Please Selected A Row.");
      return;
    }
    const amount = parseFloat(sale_price) * parseFloat(quantity_no);
    try {
      const response = await axiosInstance.put(
        `/transactionsRouter/updateTransactionFromAnyPageByID?quantity_no=${quantity_no}&sale_price=${sale_price}&transaction_id=${selectedID}&amount=${amount}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Successfully Product Sale Updateded.");

        handleClickShowAll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateAllData = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (!selectedID) {
      toast.warning("Please Selected A Row.");
      return;
    }
    if (!transaction_id) {
      toast.warning("Please Selected A Row.");
      return;
    }

    const updatedata = {
      transaction_id: transaction_id,
      invoice_no: invoice_no,
      product_trace_id: product_trace_id,
      quantity_no: quantity_no,
      unit_id: unit_id,
      brand_id: brand_id || null,
      warranty: warranty,
      tax_id: tax_id || 0,
      amount: amount,
      authorized_by_id: authorized_by_id,
      contributor_name_id: contributor_name_id || null,
      operation_type_id: operation_type_id || null,
      date: date,
      payment_type_id: payment_type_id || null,
      paid: paid || 0,
      purchase_price: purchase_price,
      sale_price: sale_price,
      discount: discount,
      shop_name_id: shop_name_id,
      other_cost: other_cost,
      comment: comment,
    };
    try {
      const response = await axiosInstance.put(
        "/transactionsRouter/updateTransactionAllFromAnyPageByID",
        updatedata
      );
      if (response.status === 200) {
        toast.success("Successfully Product Sale Updateded.");

        handleClickShowAll();
      }
    } catch (error) {
      console.log("Problem Found", error);
    }
  };

  const handleReset = () => {
    setSelectedID(null);
    setTranstionId("");
    setCode("");
    setProduct("");
    setPtype("");
    setUnit("");
    setQuantity("");
    // setTotal(parseFloat(item.sale_price) * parseFloat(item.quantity_no));
    setTotal("");
    setWarranty("");
    setDate("");
    setSalePrice("");
    setShopName("");
    setProductName("");
    setDateFrom("");
    setDateTo("");
    setType("");
    setFilteredRows("");
  };
  console.log("Quab", quantity_no, sale_price);
  useEffect(() => {
    if (quantity_no !== "" && sale_price !== "") {
      const total = (parseFloat(quantity_no) * parseFloat(sale_price)).toFixed(
        1
      );
      setTotal(total || 0);
    }
  }, [quantity_no, sale_price]);

  const hendleDataInputField = (item) => {
    setSelectedID(item.transaction_id);
    setTranstionId(item.transaction_id);
    setInvoiceNo(item.invoice_no);
    setProductTranceId(item.product_trace_id);
    setBardId(brand_id);
    setCode(item.ProductTrace ? item.ProductTrace.product_code : "");
    setProduct(item.ProductTrace ? item.ProductTrace.name : "");
    setPtype(item.ProductTrace ? item.ProductTrace.type : "");
    setUnit(item.Unit ? item.Unit.unit : "");
    setUnitId(item.unit_id);
    setQuantity(item.quantity_no);
    setTaxId(item.tax_id);
    setAuthorizedById(item.authorized_by_id);
    setContributorNameId(item.contributor_name_id);
    setOperationTypeId(item.operation_type_id);
    setOtherCost(item.other_cost);
    setPaymentTypeId(item.payment_type_id);
    setShopNameId(item.shop_name_id);
    // setTotal(parseFloat(item.sale_price) * parseFloat(item.quantity_no));
    setTotal(
      (
        parseFloat(item.sale_price || 0) *
        parseFloat(item.quantity_no || 0) *
        (1 - parseFloat(item.discount || 0) / 100)
      ).toFixed(1)
    );
    setItemTotals(
      (
        parseFloat(item.sale_price || 0) *
        parseFloat(item.quantity_no || 0) *
        (1 - parseFloat(item.discount || 0) / 100)
      ).toFixed(1)
    );
    setAmount(item.amount);
    setPaid(item.paid);
    setPurchasePrice(item.purchase_price);
    setDiscount(item.discount);
    setWarranty(item.warranty);
    setComment(item.comment);
    setDate(item.date ? item.date.split("T")[0] : "");
    setSalePrice(item.sale_price);
    setShopName(item.ShopName ? item.ShopName.shop_name : "");
  };

  console.log("transcation id", selectedID);

  const totalAmount =
    rows && rows.length > 0
      ? rows
          .reduce((total, item) => {
            const amount = parseFloat(item.sale_price) || 0;
            const qunatity = parseFloat(item.quantity_no) || 0;
            const discount = 1 - parseFloat(item.discount || 0) / 100;
            const itemTotal = amount * qunatity * discount;
            total += itemTotal;
            return total;
          }, 0)
          .toFixed(2)
      : 0;

  // const dateAquire = rows && rows.length > 0;
  const dateAquire =
    rows && rows.length > 0 ? rows[0].date.split("T")[0] : null;

  const VAT =
    rows && rows.length > 0 ? (rows[0].vat !== undefined ? rows[0].vat : 0) : 0;
  const discounts =
    rows && rows.length > 0
      ? rows[0].discount !== undefined
        ? rows[0].discount
        : 0
      : 0;

  const invoiceNumber = rows && rows.length > 0 ? rows[0].invoice_no : null;
  //========= deleteTransection================
  const deleteTransection = async () => {
    try {
      if (!selectedID) {
        //toast message:
        toast.error("Please Selected A Row !");
      } else {
        const response = await axiosInstance.delete(
          `/transactionsRouter/deleteTransactionByID?transaction_id=${selectedID}`
        );

        if (response.status === 200) {
          handleClickShowAll();
          handleReset();
          toast.success("Successfully deleted transection.");
        } else {
          console.log(`Error while deleting transection`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="full_div_supershop_sale_report">
      <ToastContainer stacked autoClose={500} />
      <div className="first_row_div_supershop_sale_report">
        <div className="container_supershop_sale_report">
          <div className="container_supershop_sale_report_column1">
            <div>
              <div className="input_field_supershop_sale_report">
                <label>From Date</label>
                <input
                  type="date"
                  onChange={(e) => setDateFrom(e.target.value)}
                  value={DateFrom}
                />
              </div>

              <div className="input_field_supershop_sale_report">
                <label>To Date</label>
                <input
                  type="date"
                  onChange={(e) => setDateTo(e.target.value)}
                  value={DateTo}
                />
              </div>
            </div>
            <div className="input_field_supershop_sale_report">
              <button onClick={handleFilterDate}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column2">
            <div className="input_field_supershop_sale_report">
              <label>Porduct</label>
              <input
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
                list="product"
              />
              <datalist id="product">
                {distinctProductCode.length > 0 &&
                  distinctProductCode.map((items, index) => {
                    return <option key={index}>{items.name}</option>;
                  })}
              </datalist>
              <button onClick={handleFilterProduct}>Search</button>
            </div>
            {/* <div className="input_field_supershop_sale_report">
              <label>Type</label>
              <input
                onChange={(e) => setType(e.target.value)}
                value={type}
                list="type"
              />
              <datalist id="type">
                {distinctProductCode.length > 0 &&
                  distinctProductCode.map((items, index) => {
                    return <option key={index}>{items.type}</option>;
                  })}
              </datalist>
              <button onClick={handleFilterType}>Search</button>
            </div> */}
            <div className="input_field_supershop_sale_report">
              <label>Invoice</label>
              <input
                onChange={(e) => setSelectedInvoice(e.target.value)}
                value={selectedInvoice}
                list="invoice"
              />
              <datalist id="invoice">
                {invoice.length > 0 &&
                  invoice.map((items, index) => {
                    return <option key={index}>{items}</option>;
                  })}
              </datalist>
              <button onClick={handleFilterInvoice}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column3">
            <div className="input_field_supershop_sale_report">
              <label>Date</label>
              <input
                type="date"
                onChange={(e) => setOnlyDate(e.target.value)}
                value={onlyDate}
              />
              <button onClick={handleFilterOnlyDate}>Search</button>
            </div>
            <div className="input_field_supershop_sale_report">
              <label>BarCode</label>
              <input
                value={filteredRows}
                onChange={(event) => setFilteredRows(event.target.value)}
                list="barcode"
              />
              <datalist id="barcode">
                {distinctProductCode.length > 0 &&
                  distinctProductCode.map((items, index) => {
                    return <option key={index}>{items.product_code}</option>;
                  })}
              </datalist>

              <button onClick={handleFilterDataCode}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column4">
            <div className="container_sheet_button_sale_report">
              <button onClick={handelShowSaleData}>
                <MdPreview />
              </button>
              <span>Show All</span>
            </div>
            <div>
              <ExcelExport />
            </div>
          </div>
        </div>
      </div>
      <div className="second_row_div_supershop_sale_report">
        {isLoading ? (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        ) : (
          <div className="container_table_supershop_sale_report">
            <table>
              <tr>
                <th>Invoice No</th>
                <th>BarCode</th>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Sale Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Item Total</th>
                <th>Sale Date</th>
                <th>Unit</th>
                <th>Shop Name</th>
              </tr>
              <tbody>
                {rows.length > 0 &&
                  rows.map((item) => (
                    <tr
                      key={item.transaction_id}
                      onClick={() => hendleDataInputField(item)}
                      className={
                        selectedID === item.transaction_id
                          ? "rows selected"
                          : "rows"
                      }
                      tabindex="0"
                    >
                      <td>{item.invoice_no}</td>

                      <td>
                        {item.ProductTrace
                          ? item.ProductTrace.product_code
                          : ""}
                      </td>
                      <td>{item.ProductTrace ? item.ProductTrace.name : ""}</td>
                      <td>{item.ProductTrace ? item.ProductTrace.type : ""}</td>
                      <td>{item.sale_price}</td>
                      <td>{item.quantity_no}</td>
                      <td>{item.discount}%</td>
                      <td>
                        {(
                          parseFloat(item.sale_price || 0) *
                          parseFloat(item.quantity_no || 0) *
                          (1 - parseFloat(item.discount || 0) / 100)
                        ).toFixed(1)}
                      </td>
                      <td className="hover-effect">
                        {item.date ? item.date.split("T")[0] : ""}
                      </td>
                      <td className="hover-effect">
                        {item.Unit ? item.Unit.unit : ""}
                      </td>
                      <td className="hover-effect">
                        {item.ShopName ? item.ShopName.shop_name : ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="third_row_div_supershop_sale_report">
        <div className="conatiner_update_supershop_sale_report_column1">
          <div className="input_field_supershop_sale_report">
            <label>BarCode</label>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              list="code"
            />
            <datalist id="code">
              {fixData.length > 0 && (
                <>
                  {[
                    ...new Set(
                      fixData.map((item) => item.ProductTrace?.product_code)
                    ),
                  ].map((productCode, index) => (
                    <option key={index}>{productCode}</option>
                  ))}
                </>
              )}
            </datalist>
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Product Name</label>
            <input
              value={product}
              onChange={(event) => setProduct(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Product Type</label>
            <input
              value={ptype}
              onChange={(event) => setPtype(event.target.value)}
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column2">
          <div className="input_field_supershop_sale_report">
            <label>Sale Price</label>
            <input
              type="number"
              value={sale_price}
              onChange={(event) => setSalePrice(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity_no}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Item Total</label>
            <input
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              disabled
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column3">
          <div className="input_field_supershop_sale_report">
            <label>Unit</label>
            <input
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Sale Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="input_field_supershop_sale_report">
            <label>Shop Name</label>
            <input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column4">
          <div className="container_sheet_button_sale_report">
            <button onClick={handleReset}>
              <BiReset />
            </button>
            <span>Reset</span>
          </div>
          {buttonVisible && (
            <div>
              <div style={{ display: "none" }}>
                <SaleReportPos
                  ref={componentRef}
                  discount={discounts}
                  VAT={VAT}
                  dateAquire={dateAquire}
                  rows={rows}
                  totalAmount={totalAmount}
                  invoiceNumber={invoiceNumber}
                  // paid={paid}
                />
              </div>
              <div className="container_sheet_button_sale_report">
                <button onClick={handlePrint}>
                  <MdLocalPrintshop />
                </button>
                <span>Invoice</span>
              </div>
            </div>
          )}
          <div className="container_sheet_button_sale_report">
            <button onClick={UpdateAllData}>
              <RxUpdate />
            </button>
            <span>Update</span>
          </div>
        </div>

        <div className="conatiner_update_supershop_sale_report_column5">
          <div className="input_field_supershop_sale_report">
            <label style={{ justifyContent: "center" }}>Total Sale</label>
            <input
              style={{
                width: "11vw",
                marginRight: "1vw",
                fontSize: "1vw",
                textAlign: "center",
                fontWeight: "bold",
              }}
              value={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleReport;
