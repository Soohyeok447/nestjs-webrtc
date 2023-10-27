import moment from 'moment';

class DateService {
  public isValidDate(date?: string): boolean {
    if (moment(date, 'YYYY-MM-DD', true).isValid()) {
      const parsedDate = moment(date, 'YYYY-MM-DD');
      return parsedDate.isValid();
    }
    return false;
  }
}

export default new DateService();
