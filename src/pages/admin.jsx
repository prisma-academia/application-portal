import React from "react";
import { mkConfig, download, generateCsv } from "export-to-csv";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../store/auth";
import MyButton from "../components/button";
import FormInput from "../components/forminput";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import millify from "millify";
import config from "../config";
import configs from "../config";

function AdminView() {
  const token = useAuthStore((state) => state.token);
  const { data: applications, error } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });
  async function getApplications() {
    const response = await fetch(
      `${config.baseUrl}/api/v1/application?status=paid`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.ok) {
      return result.data;
    }
    throw new Error(result.message);
  }

  const { data: analytics } = useQuery({
    queryKey: ["preference"],
    queryFn: getAnalytics,
  });
  async function getAnalytics() {
    const response = await fetch(`${config.baseUrl}/api/v1/analytics`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.ok) {
      return result.data;
    }
    throw new Error(result.message);
  }
  const columns = React.useMemo(
    () => [
      {
        accessorFn: (row) =>
          `${row.firstName} ${row.lastName} ${row?.otherName}`,
        id: "fullName",
        header: "Name",
        filterVariant: "text", // default
        size: 200,
      },
      {
        accessorKey: "number",
        header: "Application No",
        size: 80,
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
      },
      {
        accessorKey: "programme",
        header: "Programme",
        filterVariant: "select",
        // no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: "gender",
        header: "Gender",
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "stateOfOrigin",
        header: "State Origin",
        filterVariant: "multi-select",
        // no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: "lgaOfOrigin",
        header: "LGA Origin",
        filterVariant: "multi-select",
        // no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: "email",
        header: "Email",
        filterVariant: "string",
        size: 200,
        // no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        size: 120,
      },
      {
        accessorKey: "dob",
        header: "Age",
        size: 50,
        // filterVariant: "range-slider",
        // no need to specify filterSelectOptions if using faceted values
      },

      {
        accessorKey: "nin",
        header: "NIN",
        // filterVariant: 'multi-select',
        // no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: "stateOfResidence",
        header: "Residence State",
        filterVariant: "multi-select",
        // no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: "lgaOfResidence",
        header: "Residence LGA",
        filterVariant: "multi-select",
        // no need to specify filterSelectOptions if using faceted values
      },
    ],
    []
  );
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    filename: `abna-ibi-applications-f-${Date.now()}`,
    useKeysAsHeaders: true,
  });
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const finalData = rowData.map((row) => {
      const {
        __v,
        _id,
        authId,
        createdAt,
        updatedAt,
        examinations,
        result,
        payment,
        photo,
        ...rest
      } = row;
      return rest;
    });
    const csv = generateCsv(csvConfig)(finalData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: applications || [],
    enableFacetedValues: true,
    enableRowSelection: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: false,
      density: "compact",
      // isLoading:!data?true:false
    },
    renderTopToolbarCustomActions: ({ tableCtx }) => (
      <MyButton
        variant="outlined"
        disabled={
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        // only export selected rows
        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
      >
        Export
      </MyButton>
    ),
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
      variant: "outlined",
    },
    paginationDisplayMode: "default",
  });

  return (
    <div>
      <PreferenceModel />
      <div className="bg-base-100 flex justify-between align-center items-center mb-10 mt-5">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Users</div>
            <div className="stat-value">{analytics?.authCount || 0}</div>
            <div className="stat-desc">This Month</div>
          </div>

          <div className="stat">
            <div className="stat-title">Applications</div>
            <div className="stat-value">{analytics?.applicationCount || 0}</div>
            <div className="stat-desc">↗︎ 0 (0%)</div>
          </div>

          <div className="stat">
            <div className="stat-title">Online</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">↘︎ 0 (0%)</div>
          </div>
        </div>

        <div className="stats text-secondary">
          <div className="stat">
            <div className="stat-title">Account balance</div>
            <div className="stat-value">
              &#8358;{millify(analytics?.transactions?.totalVolume / 100 || 0)}
            </div>
            <div className="stat-actions">
              {/* <button className="btn btn-sm btn-success">Add funds</button> */}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Current balance</div>
            <div className="stat-value">
              &#8358;
              {millify(analytics?.transactions?.pendingTransfers / 100 || 0)}
            </div>
            <div className="stat-actions">
              {/* <button className="btn btn-sm">Withdrawal</button> */}
              {/* <button className="btn btn-sm">Deposit</button> */}
            </div>
          </div>
        </div>
      </div>
      <MaterialReactTable table={table} />
    </div>
  );
}

export default AdminView;

const PreferenceModel = () => {
  const token = useAuthStore((state) => state.token);

  const formik = useFormik({
    initialValues: {
      price: 1000000,
      closingDate: "",
      announcement: "",
    },
    validationSchema: Yup.object({
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be positive"),
      closingDate: Yup.date().required("Closing Date is required"),
      announcement: Yup.string().required("Announcement is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        mutate(values);
        resetForm();
        document.getElementById("my_modal_1").close();
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const putPreference = async (credentials) => {
    const response = await fetch(`${configs.baseUrl}/api/v1/preference`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.ok) {
      return result.data;
    }
    throw new Error(result.message);
  };

  const { data, mutate, isError, isPending, failureReason } = useMutation({
    mutationFn: putPreference,
    onSuccess: () =>
      QueryClient.invalidateQueries({ queryKey: ["preference"] }),
  });

  return (
    <>
      <MyButton
        text="Preference"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </MyButton>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Preference</h3>
          <form onSubmit={formik.handleSubmit} method="dialog">
            <div className="flex justify-between">
              <FormInput
                label="Price"
                placeholder="Enter price"
                formik={formik}
                name="price"
                type="number"
              />
              <FormInput
                label="Closing Date"
                placeholder="Select closing date"
                formik={formik}
                name="closingDate"
                type="date"
              />
            </div>
            <FormInput
              label="Announcement"
              placeholder="Enter announcement"
              formik={formik}
              name="announcement"
              type="text"
            />
            <div className="flex justify-end gap-3">
              <MyButton
                variant="outlined"
                type="button"
                onClick={() => document.getElementById("my_modal_1").close()}
              >
                Close
              </MyButton>
              <MyButton type="submit" disabled={formik.isSubmitting}>
                Update
              </MyButton>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};
