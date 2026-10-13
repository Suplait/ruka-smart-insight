// Project only identifiers already returned by the commercial workflow.
// Never create a task or guess between multiple search results.
export function prepareClickupLink(tasks, webhookBody) {
  if (webhookBody?.type !== 'INSERT' || webhookBody?.schema !== 'public' || webhookBody?.table !== 'leads') return null;
  const submission = webhookBody.record?.submission_id;
  if (typeof submission !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(submission)) return null;
  if (!Array.isArray(tasks) || tasks.length !== 1) return null;
  const task = tasks[0];
  if (typeof task?.id !== 'string' || !/^[a-zA-Z0-9]{1,50}$/.test(task.id) || String(task.list?.id) !== '901301203866') return null;
  return { p_submission: submission, p_task_id: task.id, p_list_id: '901301203866' };
}
