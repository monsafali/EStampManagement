import React from "react";
import "../../styles/components/DataTable.css";



const DataTable = ({ title, columns, data, renderActions }) => {
  return (
    <div className="manage-info-card">
      {title && <h3 className="manage-info-title">{title}</h3>}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {renderActions && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row._id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row)
                        : row[col.key]}
                    </td>
                  ))}

                  {renderActions && (
                    <td>{renderActions(row)}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="table-empty" >
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default DataTable;
