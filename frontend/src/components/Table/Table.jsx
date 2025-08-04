import { Table as TableComponent } from 'antd';
import { forwardRef } from 'react';

const Table = forwardRef((props, ref) => (
  <TableComponent {...props} ref={ref} />
));

Table.displayName = 'Table';

export default Table;
