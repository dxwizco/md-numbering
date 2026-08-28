When "md-numbering.startLevel": 1
Series-1

# L1

## L2

### L3

<!-- #### L4 -->

##### L5

###### L6

A skipped heading is excluded from the numbering hierarchy. Its numbered descendants are attached to the nearest non-skipped numbered ancestor.

Here below L1 is skipped so L2 gets number form previous sequence.

Series-2

# L1<!-- skip -->

## L2 This will get series-1 sequence as L1 is skipped

### L3

#### L4 <!-- skip -->

##### L5 Here this will get sub sequence from above parent

###### L6

In below nothing is consuming number and even they are here considered they are not here for numbering purpose
series-3

# L1 <!-- skip-all -->

## L2

### L3

#### L4

##### L5

###### L6

series 4

# L1 This gets sequence 2 as actual 2 is skipped and 3 is gone

## L2

```
### L3
```

#### L4

##### L5

###### L6

# L1 <!-- skip -->

## L2 This gets number from previous parent as own parent is skipped

### L3

#### L4

##### L5 <!-- skip-all -->

###### L6 this will not get the number as it parent is skip all

<!-- # L1

## L2

### L3

#### L4

##### L5

###### L6 -->

# Project

## Section

### Normal

## Ignored <!-- skip-all -->

### Should stay unchanged

#### Should also stay unchanged

## Next

### Child

# L-1

### L-3 skip-all <!-- skip-all -->

#### L-4 Should skip

##### L-5 Should skip

### L-3

#### L-4
