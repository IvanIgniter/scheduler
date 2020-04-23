import moment from 'moment';

export const formatDate = (value, format = 'YYYY-MM-DD HH:mm') =>
  moment(value).format(format);