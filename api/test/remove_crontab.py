from crontab import CronTab

with CronTab(user = 'student') as cron:
    cron.remove_all(comment='Fetch Restaurant Data')