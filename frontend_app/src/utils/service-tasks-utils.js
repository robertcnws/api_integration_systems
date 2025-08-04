export const availableTasks = (service, serviceTasks, CONFIG) => {
    const initialTasks = serviceTasks?.filter((t) => t.service_default_task?.is_active);
    const tasks = initialTasks?.map((t) => ({
        ...t,
        number: `T-${String(t.service_default_task.order).padStart(3, "0")}`,
    }));
    const sortedTasks = tasks?.sort(
        (a, b) => a.service_default_task.order - b.service_default_task.order
    );
    let foundNotStarted = false;

    const nextTasks = sortedTasks?.filter((t) => {
        if (t.status !== "not started") return true;
        if (!foundNotStarted) {
            foundNotStarted = true;
            return true;
        }
        return false;
    });

    const finalTasks = nextTasks?.filter(
        (t) => t.service_default_task?.service_stage?.name !== CONFIG.stages.permission
    );

    const uniqueFinalTasks = [...new Map(finalTasks?.map(task => [task?.service_default_task?.id, task])).values()];
    return uniqueFinalTasks;
}


export const totalPercentageService = (service, CONFIG) => {
    const serviceTasks = service?.serviceDefaultTasks;
    const total = serviceTasks?.reduce((acc, t) => acc + t.percentage, 0);
    const percentage = total / serviceTasks.length || 0;
    return percentage;
}

export const totalPercentageServiceStage = (service, stage, CONFIG) => {
    const serviceTasks = service?.serviceDefaultTasks;
    const stageTasks = serviceTasks?.filter(
        (t) => t.service_default_task?.service_stage?.name === stage
    );
    const total = stageTasks?.reduce((acc, t) => acc + t.percentage, 0);
    const percentage = total / stageTasks.length || 0;
    return percentage;
}

export const getServiceInstaller = (service, CONFIG) => {
    const users = service?.usersServiceTeam

    const installer = users?.filter(
        (user) => {
            const objRole = user?.userRole || user?.user_role;
            return objRole.name.toLowerCase().includes(CONFIG.roles.installer.toLowerCase())
        }
    )[0];

    return installer;
};


export const filteredDescription = (description) => description
    .split('\n')
    .filter(line => {
        const parts = line.split(':');
        return parts.length < 2 || parts[1].trim() !== '';
    })
    .join('\n');


export const filteredSomeDescription = (description, someFields) => description
    .split('\n')
    .filter(line => {
        const parts = line.split(':');
        return parts.length < 2 || (parts[1].trim() !== '' && someFields.some(field => parts[0].trim().toLowerCase().includes(field.toLowerCase())));
    })
    .join('\n');


export const filteredDescriptionJson = (description) => description
    .split('\n')
    .map(line => line.split(':'))
    .filter(parts => parts.length >= 2 && parts[1].trim() !== '')
    .reduce((acc, parts) => {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        acc[key] = value;
        return acc;
    }, {});

export const previousTasks = (task, serviceTasks) => {
    const tasks = serviceTasks?.filter(
        (t) => t.service_default_task.order < task.service_default_task.order
    );
    return tasks;
}

export const previousTasksInStatus = (task, serviceTasks, status) => {
    const tasks = previousTasks(task, serviceTasks);
    return tasks?.filter((t) => t.status === status);
}

export function getServiceAttachments(service, stageName = null) {
    const attachmentType = stageName ? (
        stageName.toLowerCase() === 'preparation' ? 
        'issued' : stageName.toLowerCase()
    ) : null;
    const allAttachments = {
        service: [],
    }
    const serviceAttachments = (attachmentType ?
        service?.serviceAttachments?.filter(
            (attachment) => attachment?.attachment_type?.toLowerCase() === attachmentType.toLowerCase()
        ) :
        service?.serviceAttachments) || [];

    allAttachments.service = serviceAttachments;

    return allAttachments;
}