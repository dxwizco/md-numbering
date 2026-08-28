# Markdown Heading Numbering — Full Test Cases <!-- skip -->

Basic numbering

# L-1 Should get 1.

## L-2 Should get 1.1

### L-3 Should get 1.1.1

#### L-4 Should get 1.1.1.1

##### L-5 Should get 1.1.1.1.1

###### L-6 Should get 1.1.1.1.1.1

# L-1 Should get 2.

## L-2 Should get 2.1

skip-all

## L-2 Should skip this heading and all descendants <!-- skip-all -->

### L-3 Should skip

##### L-5 Should skip

##### L-5 Should skip

###### L-6 Should skip

## L-2 Should get 3. as this is the first L-2 after skip-all

### L-3 Should get 3.1

#### L-4 Should get 3.1.1

skip

### L-3 skipped <!-- skip -->

#### L-4 Should get 3.2 because L-3 is skipped

##### L-5 Should get 3.2.1

###### L-6 Should get 3.2.1.1

###### L-6 Should get 3.2.1.2

##### L-5 Should get 3.2.2

###### L-6 Should get 3.2.2.1

##### L-5 Should get 3.2.3

### L-3 Should get 3.3 because it is the next L-3

#### L-4 Should get 3.3.1

##### L-5 Should get 3.3.1.1

###### L-6 Should get 3.3.1.1.1

Multiple skipped levels

# L-1 Should get 4.

#### L-4 Should get 4.1 because there is no L-2 or L-3 under this L-1

##### L-5 Should get 4.1.1

###### L-6 Should get 4.1.1.1

#### L-4 Should get 4.2

##### L-5 Should get 4.2.1

skip followed by sibling

# L-1 Should get 5.

## L-2 skipped <!-- skip -->

## L-2 Should get 5.1 because the previous L-2 was skipped

### L-3 Should get 5.1.1

skip-all followed by sibling

# L-1 Should get 6.

## L-2 skip-all <!-- skip-all -->

## L-3 Should skip

#### L-4 Should skip

##### L-5 Should skip

## L-2 Should get 6.1 because it is a sibling of the skip-all heading

### L-3 Should get 6.1.1

skip-all with deeper levels

# L-1 Should get 7.

## L-2 skip-all <!-- skip-all -->

### L-3 Should skip

#### L-4 Should skip

##### L-5 Should skip

## L-2 Should get 7.1

#### L-4 Should get 7.1.1 because L-3 is absent

##### L-5 Should get 7.1.1.1

Consecutive skip headings

# L-1 Should get 8.

## L-2 skipped <!-- skip -->

### L-3 skipped <!-- skip -->

#### L-4 Should get 8.1 because both ancestors were skipped

##### L-5 Should get 8.1.1

Root-level skip

# L-1 skipped <!-- skip -->

## L-2 Should get 9. because skipped H1 does not exist in the logical hierarchy

### L-3 Should get 9.1

#### L-4 Should get 9.1.1

Root-level skip-all

# L-1 skip-all <!-- skip-all -->

## L-2 Should skip

### L-3 Should skip

#### L-4 Should skip

# L-1 Should get 10. because it is outside the skip-all subtree

## L-2 Should get 10.1

Document without H1

### L-3 Should get 11.

#### L-4 Should get 11.1

### L-3 Should get 12.

##### L-5 Should get 12.1

###### L-6 Should get 12.1.1

Deep nesting and returning to higher levels

# L-1 Should get 13.

###### L-6 Should get 13.1 because no intermediate levels exist

## L-2 Should get 13.2 because numbering returns to H2

##### L-5 Should get 13.2.1

### L-3 Should get 13.3 because numbering returns to H3

###### L-6 Should get 13.3.1

#### L-4 Should get 13.3.2

## L-2 Should get 13.4

skip-all at different levels

# L-1 Should get 14.

### L-3 skip-all <!-- skip-all -->

#### L-4 Should skip

##### L-5 Should skip

###### L-6 Should skip

### L-3 Should get 14.1 because it is outside the previous skip-all subtree

#### L-4 Should get 14.1.1

skip at different levels

# L-1 Should get 15.

### L-3 skipped <!-- skip -->

#### L-4 Should get 15.1

##### L-5 Should get 15.1.1

### L-3 Should get 15.2

#### L-4 Should get 15.2.1

skip-all with no children

# L-1 Should get 16.

## L-2 skip-all <!-- skip-all -->

## L-2 Should get 16.1

Invalid heading levels

# L-1 Should get 17.

## L-2 Should get 17.1

####### Not a Level

### L-3 Should get 17.2

#### L-4 Should get 17.2.1

####### Still Not a Level

##### L-5 Should get 17.2.1.1

Combined realistic case

# L-1 Should get 18.

## L-2 Should get 18.1

### L-3 skipped <!-- skip -->

#### L-4 Should get 18.1.1

##### L-5 Should get 18.1.1.1

## L-2 skip-all <!-- skip-all -->

### L-3 Should skip

#### L-4 Should skip

###### L-6 Should skip

## L-2 Should get 18.2

#### L-4 Should get 18.2.1

##### L-5 Should get 18.2.1.1

### L-3 Should get 18.3

#### L-4 Should get 18.3.1

# L-1 Should get 19.

#### L-4 Should get 19.1 because there are no L-2 or L-3 headings

##### L-5 Should get 19.1.1

###### L-6 Should get 19.1.1.1

#### L-4 Should get 19.2

##### L-5 Should get 19.2.1

###### L-6 Should get 19.2.1.1

## L-2 Should get 20.

### L-3 skipped <!-- skip -->

#### L-4 Should get 20.1

##### L-5 Should get 20.1.1

###### L-6 Should get 20.1.1.1

# L-1 Should get 21.

#### L-4 Should get 21.1
