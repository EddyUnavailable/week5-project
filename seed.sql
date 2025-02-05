create table if not exists facts(
id int primary key generated always as identity,
fact varchar(100),
result text
);

insert into facts (fact, result) values 
('Toilet paper', 'Toilet paper is thought to have first been produced in the late 800s AD in China.​'),
('Mt Everest', 'There are around 200 corpses on Mount Everest, many of which are used as markers for climbers.'),
('Body', 'Every minute the human body sheds over 30,000 dead skin cells.'),
('Koolaid', 'Kool-Aid was invented in Hastings, Nebraska in the year 1927.'),
('Guinea Pig', 'In Switzerland it is illegal to own just one guinea pig. This is because they are highly social, and its considered animal abuse to have one.'),
('Heart Attacks','Heart attacks are more likely to happen on a Monday compared to other days of the week (20% more likely for men, 15% more likely for women).'),
('Cat','The average life span of a pet cat has more than doubled from the 1980s to 2021, increasing from 7 years to 15 years'),
('40','“Forty” is the only number that is spelt with letters arranged in alphabetical order.');

SELECT * From facts;

SELECT FACT FROM facts;
SELECT result, id FROM facts;

SELECT facts FROM facts WHERE id = 1