// loading ora
import ora from 'ora';

export const spinFn = (fn, loadingText) => async (...args) => {
  const spinner = ora(loadingText).start();
  const data = await fn(args);
  spinner.succeed();
  return data;
}
