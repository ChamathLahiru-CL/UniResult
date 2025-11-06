export function getSemesterColor(semester) {
  switch (semester) {
    case 1:
      return 'bg-sky-500';
    case 2:
      return 'bg-indigo-500';
    case 3:
      return 'bg-purple-500';
    case 4:
      return 'bg-violet-500';
    default:
      return 'bg-slate-500';
  }
}