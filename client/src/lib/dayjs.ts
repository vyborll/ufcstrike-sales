import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedTime from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedTime);

export default dayjs;
